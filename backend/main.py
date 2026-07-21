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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
