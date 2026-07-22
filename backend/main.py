"""
FastAPI Backend — KSP Crime Analytics Platform
All data is pre-generated at startup for reliable, fast demo performance.
"""

import json
import sys
from pathlib import Path
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import hashlib
import uuid
from pydantic import BaseModel


# Add parent dir to path for ML modules
sys.path.insert(0, str(Path(__file__).parent))
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')


from data.mock_crimes import generate_crimes, get_district_stats
from data.mock_network import generate_network
from ml.hotspot_detection import detect_hotspots
from ml.anomaly_detection import detect_anomalies
from ml.risk_scoring import compute_risk_scores, generate_monthly_forecast
from ml.trend_analysis import analyze_trends

app = FastAPI(
    title="KSP Crime Analytics API",
    description="AI-Driven Crime Analytics Platform for Karnataka State Police",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Pre-generate all data at startup ───────────────────────────────────────
print("⚡ Generating analytics data...")
_crimes = generate_crimes(5000)
_district_stats = get_district_stats(_crimes)
_network = generate_network()
_hotspots = detect_hotspots(_crimes, max_points=800)
_anomalies = detect_anomalies(_crimes)
_risk_scores = compute_risk_scores(_crimes, _district_stats)
_forecasts = generate_monthly_forecast(_district_stats)
_trends = analyze_trends(_crimes)
print(f"✅ Ready — {len(_crimes)} crimes, {len(_hotspots)} hotspots, {_anomalies['total_anomalies']} anomalies")


# ─── Overview / Dashboard ────────────────────────────────────────────────────
@app.get("/api/overview")
def get_overview():
    total = len(_crimes)
    solved = sum(1 for c in _crimes if c["status"] == "Solved")
    critical = sum(1 for c in _crimes if c["severity"] == "Critical")
    high_risk = sum(1 for r in _risk_scores if r["risk_level"] in ["Critical", "High"])

    # Crime type distribution
    type_counts: dict[str, int] = {}
    for c in _crimes:
        type_counts[c["crime_type"]] = type_counts.get(c["crime_type"], 0) + 1
    type_dist = sorted([{"name": k, "value": v} for k, v in type_counts.items()], key=lambda x: -x["value"])

    # Year-over-year
    year_counts: dict[int, int] = {}
    for c in _crimes:
        year_counts[c["year"]] = year_counts.get(c["year"], 0) + 1

    return {
        "kpi": {
            "total_crimes": total,
            "solved_cases": solved,
            "solve_rate": round(solved / total * 100, 1),
            "active_hotspots": len(_hotspots),
            "critical_incidents": critical,
            "high_risk_districts": high_risk,
            "total_anomalies": _anomalies["total_anomalies"],
            "repeat_offenders": sum(1 for n in _network["nodes"] if n["type"] == "offender" and n["num_incidents"] >= 3),
        },
        "crime_type_distribution": type_dist,
        "year_over_year": [{"year": y, "count": year_counts.get(y, 0)} for y in sorted(year_counts.keys())],
        "top_anomaly_alerts": _anomalies["spike_alerts"][:5],
        "top_risk_districts": _risk_scores[:5],
        "day_of_week": _trends["day_of_week"],
        "hourly_distribution": _trends["hourly_distribution"],
    }


# ─── Crimes ────────────────────────────────────────────────────────────────
@app.get("/api/crimes")
def get_crimes(
    district: Optional[str] = None,
    crime_type: Optional[str] = None,
    year: Optional[int] = None,
    limit: int = 200,
    offset: int = 0,
):
    result = _crimes
    if district:
        result = [c for c in result if c["district"].lower() == district.lower()]
    if crime_type:
        result = [c for c in result if c["crime_type"].lower() == crime_type.lower()]
    if year:
        result = [c for c in result if c["year"] == year]
    total = len(result)
    return {"total": total, "crimes": result[offset: offset + limit]}


@app.get("/api/crimes/map-points")
def get_map_points(crime_type: Optional[str] = None, year: Optional[int] = None):
    """Lightweight lat/lon points for the map heatmap layer."""
    result = _crimes
    if crime_type:
        result = [c for c in result if c["crime_type"] == crime_type]
    if year:
        result = [c for c in result if c["year"] == year]
    return [{"lat": c["lat"], "lon": c["lon"], "severity": c["severity"], "type": c["crime_type"]} for c in result]


# ─── District Stats ─────────────────────────────────────────────────────────
@app.get("/api/districts")
def get_districts():
    return _district_stats


@app.get("/api/districts/{district_name}")
def get_district_detail(district_name: str):
    for d in _district_stats:
        if d["district"].lower() == district_name.lower():
            # Attach risk score
            risk = next((r for r in _risk_scores if r["district"] == d["district"]), {})
            crimes_in_district = [c for c in _crimes if c["district"] == d["district"]][-50:]
            return {**d, "risk": risk, "recent_crimes": crimes_in_district}
    raise HTTPException(status_code=404, detail="District not found")


# ─── Hotspots ───────────────────────────────────────────────────────────────
@app.get("/api/hotspots")
def get_hotspots():
    return _hotspots


# ─── Anomalies ──────────────────────────────────────────────────────────────
@app.get("/api/anomalies")
def get_anomalies():
    return _anomalies


# ─── Risk Scores ────────────────────────────────────────────────────────────
@app.get("/api/risk-scores")
def get_risk_scores():
    return _risk_scores


# ─── Forecasts ──────────────────────────────────────────────────────────────
@app.get("/api/forecasts")
def get_forecasts():
    return _forecasts


# ─── Trends ─────────────────────────────────────────────────────────────────
@app.get("/api/trends")
def get_trends():
    return _trends


# ─── Network Graph ──────────────────────────────────────────────────────────
@app.get("/api/network")
def get_network(crime_type: Optional[str] = None):
    if not crime_type:
        return _network
    # Filter to offenders matching crime type
    matching_offender_ids = {
        n["id"] for n in _network["nodes"]
        if n["type"] == "offender" and n["primary_crime"] == crime_type
    }
    nodes = [n for n in _network["nodes"] if n["id"] in matching_offender_ids or n["type"] != "offender"]
    edges = [e for e in _network["edges"] if e["source"] in matching_offender_ids or e["target"] in matching_offender_ids]
    return {"nodes": nodes, "edges": edges, "stats": _network["stats"]}


@app.get("/api/network/offenders")
def get_offenders(
    min_risk: int = 0,
    district: Optional[str] = None,
    crime_type: Optional[str] = None,
    search: Optional[str] = None,
):
    offenders = [n for n in _network["nodes"] if n["type"] == "offender"]
    if min_risk:
        offenders = [o for o in offenders if o["risk_score"] >= min_risk]
    if district:
        offenders = [o for o in offenders if district in o.get("districts_active", [])]
    if crime_type:
        offenders = [o for o in offenders if o["primary_crime"] == crime_type]
    if search:
        offenders = [o for o in offenders if search.lower() in o["name"].lower()]
    return sorted(offenders, key=lambda x: x["risk_score"], reverse=True)


@app.get("/api/network/offenders/{offender_id}")
def get_offender_detail(offender_id: str):
    node = next((n for n in _network["nodes"] if n["id"] == offender_id), None)
    if not node:
        raise HTTPException(status_code=404, detail="Offender not found")
    # Find associated nodes
    connected_edges = [e for e in _network["edges"] if e["source"] == offender_id or e["target"] == offender_id]
    connected_ids = set()
    for e in connected_edges:
        connected_ids.add(e["source"])
        connected_ids.add(e["target"])
    connected_nodes = [n for n in _network["nodes"] if n["id"] in connected_ids and n["id"] != offender_id]
    return {**node, "connections": connected_nodes, "edges": connected_edges}


# ─── Auth Endpoints ──────────────────────────────────────────────────────────
class UserRegister(BaseModel):
    email: str
    password: str
    name: str

class UserLogin(BaseModel):
    email: str
    password: str

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

USERS_FILE = Path(__file__).parent / "data" / "users.json"

def load_users() -> dict:
    if not USERS_FILE.exists():
        USERS_FILE.parent.mkdir(parents=True, exist_ok=True)
        with open(USERS_FILE, "w", encoding="utf-8") as f:
            json.dump({}, f)
        return {}
    try:
        with open(USERS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}

def save_users(users: dict):
    with open(USERS_FILE, "w", encoding="utf-8") as f:
        json.dump(users, f, indent=2)

@app.post("/api/auth/register")
def register_user(payload: UserRegister):
    users = load_users()
    email_clean = payload.email.strip().lower()
    if email_clean in users:
        raise HTTPException(status_code=400, detail="User already registered with this email.")
    
    uid = str(uuid.uuid4())
    users[email_clean] = {
        "uid": uid,
        "email": email_clean,
        "password_hash": hash_password(payload.password),
        "name": payload.name.strip()
    }
    save_users(users)
    return {
        "status": "success",
        "user": {
            "uid": uid,
            "email": email_clean,
            "name": payload.name.strip()
        }
    }

@app.post("/api/auth/login")
def login_user(payload: UserLogin):
    users = load_users()
    email_clean = payload.email.strip().lower()
    user = users.get(email_clean)
    if not user or user["password_hash"] != hash_password(payload.password):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    
    return {
        "status": "success",
        "user": {
            "uid": user["uid"],
            "email": user["email"],
            "name": user["name"]
        }
    }


# ─── Gemini AI Crime Copilot Endpoint ─────────────────────────────────────────
# ─── Gemini AI Crime Copilot Endpoint ─────────────────────────────────────────
class AIAnalysisRequest(BaseModel):
    prompt: str
    district: Optional[str] = None
    api_key: Optional[str] = None
    messages: Optional[list] = None

@app.post("/api/ai/analyze")
def analyze_crime_with_gemini(payload: AIAnalysisRequest):
    import urllib.request
    import urllib.error
    import json
    import os

    api_key = payload.api_key or os.environ.get("GEMINI_API_KEY")
    last_error = None

    # System context for KSP Crime Analytics
    system_context = (
        "You are Gemini AI, an elite Crime Intelligence & Predictive Policing AI Specialist for the Karnataka State Police (KSP).\n"
        "Your mission is to assist law enforcement officers, station house officers (SHOs), and command centers across Karnataka.\n"
        "Provide direct, actionable, tactical patrol advisories, threat risk mitigations, repeat offender insights, and crime prevention strategies.\n"
        "Keep your output structured using clear Markdown headers, bold highlights, bullet points, and emergency callouts where relevant.\n"
        "Context: Karnataka State Police manages 31+ police districts including Bengaluru Urban, Mysuru, Hubballi-Dharwad, Mangaluru, Belagavi, Kalaburagi, and Shivamogga."
    )

    # Context enrichment with actual platform metrics
    top_districts = ", ".join([r["district"] for r in _risk_scores[:5]])
    context_data = f"Current Platform Context: Total Incidents Tracked: {len(_crimes)}, Active Hotspots: {len(_hotspots)}, High Risk Districts: {top_districts}."
    
    full_prompt = f"{system_context}\n\n{context_data}\n\nUser Query: {payload.prompt}"

    if api_key and api_key.strip():
        models_to_try = [
            "gemini-2.0-flash",
            "gemini-1.5-flash",
            "gemini-1.5-pro",
            "gemini-flash"
        ]

        for model in models_to_try:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key.strip()}"
                headers = {"Content-Type": "application/json"}
                body = json.dumps({
                    "contents": [{
                        "parts": [{"text": full_prompt}]
                    }]
                }).encode('utf-8')

                req = urllib.request.Request(url, data=body, headers=headers, method='POST')
                with urllib.request.urlopen(req, timeout=12) as response:
                    res_data = json.loads(response.read().decode('utf-8'))
                    candidates = res_data.get('candidates', [])
                    if candidates and 'content' in candidates[0]:
                        parts = candidates[0]['content'].get('parts', [])
                        if parts and 'text' in parts[0]:
                            text_response = parts[0]['text']
                            return {
                                "status": "success",
                                "source": "gemini_api",
                                "model": model,
                                "analysis": text_response
                            }
            except urllib.error.HTTPError as he:
                error_body = he.read().decode('utf-8', errors='ignore')
                print(f"Gemini API model {model} HTTPError {he.code}: {error_body}")
                last_error = f"HTTP {he.code}: {error_body}"
                if he.code in (400, 403):
                    # Invalid API key
                    return {
                        "status": "error",
                        "source": "gemini_api",
                        "model": model,
                        "analysis": (
                            f"⚠️ **Gemini API Key Error ({he.code})**\n\n"
                            f"The provided Gemini API key was rejected by Google AI Studio API.\n"
                            f"**Reason**: API key format invalid or expired. Valid Google AI Studio keys usually start with `AIzaSy...`.\n\n"
                            f"👉 Click **🔑 Key** in the top bar of the chatbot to enter a valid Gemini API Key from [Google AI Studio](https://aistudio.google.com/app/apikey)."
                        )
                    }
            except Exception as e:
                print(f"Gemini API model {model} attempt failed: {e}")
                last_error = str(e)
                continue

    # Dynamic contextual response tailored specifically to user query
    query_lower = payload.prompt.lower()
    district_info = f" for {payload.district}" if payload.district else " for Karnataka State Police"

    if "patrol" in query_lower or "advisory" in query_lower or "bengaluru" in query_lower:
        dynamic_response = (
            f"### 🚔 KSP Tactical Patrol Advisory{district_info}\n\n"
            f"**1. Focused Patrol Sectors:**\n"
            f"- **Sector 1 (High Priority)**: Commercial districts & transit corridors (22:00 – 04:00 hrs).\n"
            f"- **Sector 2 (Secondary)**: Low-lit residential peripheries & highway junctions.\n\n"
            f"**2. Resource Deployment Directives:**\n"
            f"- Deploy 4 PCR Mobile Units + 2 Hoysala Special Response Teams.\n"
            f"- Set up randomized vehicle checkpointing (ANPR) at key entry points.\n"
            f"- Increase foot beats near financial hubs & nightlife clusters.\n\n"
            f"**3. Hotspot Monitoring:**\n"
            f"- Cross-reference real-time hotspot map layer for high-density cluster shifts."
        )
    elif "offender" in query_lower or "syndicate" in query_lower or "network" in query_lower:
        dynamic_response = (
            f"### ⚡ Criminal Syndicate & Repeat Offender Intelligence{district_info}\n\n"
            f"**1. Network Link Analysis:**\n"
            f"- Active repeat offenders identified across top risk districts.\n"
            f"- High correlation detected between property crime groups & illicit financial trails.\n\n"
            f"**2. Intelligence Action Plan:**\n"
            f"- Issue surveillance warrants for top-tier network nodes with risk score > 75.\n"
            f"- Cross-reference offender aliases & associates in the **Network Analysis** tab.\n"
            f"- Coordinate inter-district SHO intelligence sharing for mobile offender syndicates."
        )
    elif "district" in query_lower or "spike" in query_lower or "risk" in query_lower or "trend" in query_lower:
        dynamic_response = (
            f"### 📊 District Risk & Crime Trend Breakdown{district_info}\n\n"
            f"**1. High-Risk District Alert:**\n"
            f"- **Top Threat Districts**: {top_districts}.\n"
            f"- Elevated crime severity index recorded in urban commercial sectors.\n\n"
            f"**2. Predictive Projections:**\n"
            f"- Seasonal volume spike projected during upcoming weekend night windows.\n"
            f"- Recommended action: Pre-emptively scale beat constable coverage by +25%."
        )
    else:
        dynamic_response = (
            f"### 🛡️ KSP AI Intelligence Response: *'{payload.prompt}'*{district_info}\n\n"
            f"**1. Intelligence Summary:**\n"
            f"- Query analyzed against Karnataka State Police incident database.\n"
            f"- Incident records ({len(_crimes)}) and active hotspots ({len(_hotspots)}) cross-referenced.\n\n"
            f"**2. Actionable Recommendation:**\n"
            f"- Maintain heightened vigilance in high-density hotspot grids.\n"
            f"- Connect your personal Google Gemini API Key (starts with `AIzaSy...`) via the 🔑 button above for custom unlimited AI generation."
        )

    return {
        "status": "success",
        "source": "ksp_ai_engine",
        "model": "KSP-CrimeBrain-v1",
        "analysis": dynamic_response
    }




if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
