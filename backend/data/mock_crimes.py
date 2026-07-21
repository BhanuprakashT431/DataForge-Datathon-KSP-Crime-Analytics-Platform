"""
Synthetic Crime Data Generator for Karnataka State Police Analytics Platform.
Generates ~5000 realistic crime incidents across all 31 Karnataka districts.
"""

import json
import random
import math
from datetime import datetime, timedelta
from pathlib import Path

# Karnataka districts with approximate geographic centers
KARNATAKA_DISTRICTS = [
    {"name": "Bangalore Urban", "lat": 12.9716, "lon": 77.5946, "population": 13193000, "urban_index": 0.95, "poverty_index": 0.22},
    {"name": "Bangalore Rural", "lat": 13.1685, "lon": 77.6188, "population": 990923, "urban_index": 0.45, "poverty_index": 0.35},
    {"name": "Mysuru", "lat": 12.2958, "lon": 76.6394, "population": 3001127, "urban_index": 0.60, "poverty_index": 0.30},
    {"name": "Tumkur", "lat": 13.3392, "lon": 77.1014, "population": 2678980, "urban_index": 0.40, "poverty_index": 0.40},
    {"name": "Kolar", "lat": 13.1362, "lon": 78.1337, "population": 1540231, "urban_index": 0.35, "poverty_index": 0.42},
    {"name": "Belagavi", "lat": 15.8497, "lon": 74.4977, "population": 4779661, "urban_index": 0.50, "poverty_index": 0.38},
    {"name": "Vijayapura", "lat": 16.8302, "lon": 75.7100, "population": 2175102, "urban_index": 0.45, "poverty_index": 0.45},
    {"name": "Bagalkot", "lat": 16.1691, "lon": 75.6960, "population": 1889752, "urban_index": 0.38, "poverty_index": 0.48},
    {"name": "Dharwad", "lat": 15.4589, "lon": 75.0078, "population": 1846993, "urban_index": 0.65, "poverty_index": 0.32},
    {"name": "Gadag", "lat": 15.4165, "lon": 75.6260, "population": 1065235, "urban_index": 0.42, "poverty_index": 0.44},
    {"name": "Haveri", "lat": 14.7942, "lon": 75.3992, "population": 1598506, "urban_index": 0.35, "poverty_index": 0.46},
    {"name": "Uttara Kannada", "lat": 14.7858, "lon": 74.7007, "population": 1437169, "urban_index": 0.30, "poverty_index": 0.40},
    {"name": "Dakshina Kannada", "lat": 12.8438, "lon": 75.2479, "population": 2089649, "urban_index": 0.65, "poverty_index": 0.25},
    {"name": "Udupi", "lat": 13.3409, "lon": 74.7421, "population": 1177361, "urban_index": 0.55, "poverty_index": 0.28},
    {"name": "Shivamogga", "lat": 13.9299, "lon": 75.5681, "population": 1755512, "urban_index": 0.52, "poverty_index": 0.35},
    {"name": "Chikkamagaluru", "lat": 13.3161, "lon": 75.7720, "population": 1137961, "urban_index": 0.40, "poverty_index": 0.38},
    {"name": "Hassan", "lat": 13.0072, "lon": 76.1004, "population": 1776421, "urban_index": 0.38, "poverty_index": 0.40},
    {"name": "Mandya", "lat": 12.5218, "lon": 76.8951, "population": 1808680, "urban_index": 0.40, "poverty_index": 0.38},
    {"name": "Chamarajanagar", "lat": 11.9261, "lon": 76.9441, "population": 1020791, "urban_index": 0.30, "poverty_index": 0.50},
    {"name": "Kodagu", "lat": 12.4244, "lon": 75.7382, "population": 554762, "urban_index": 0.32, "poverty_index": 0.35},
    {"name": "Raichur", "lat": 16.2076, "lon": 77.3566, "population": 1924773, "urban_index": 0.35, "poverty_index": 0.55},
    {"name": "Koppal", "lat": 15.3474, "lon": 76.1552, "population": 1393231, "urban_index": 0.30, "poverty_index": 0.52},
    {"name": "Ballari", "lat": 15.1394, "lon": 76.9214, "population": 2532383, "urban_index": 0.48, "poverty_index": 0.45},
    {"name": "Vijayanagara", "lat": 15.3447, "lon": 76.4600, "population": 1200000, "urban_index": 0.35, "poverty_index": 0.48},
    {"name": "Chitradurga", "lat": 14.2296, "lon": 76.3986, "population": 1660378, "urban_index": 0.35, "poverty_index": 0.45},
    {"name": "Davangere", "lat": 14.4644, "lon": 75.9218, "population": 1945497, "urban_index": 0.55, "poverty_index": 0.38},
    {"name": "Yadgir", "lat": 16.7674, "lon": 77.1384, "population": 1173108, "urban_index": 0.28, "poverty_index": 0.58},
    {"name": "Kalaburagi", "lat": 17.3297, "lon": 76.8197, "population": 2564892, "urban_index": 0.50, "poverty_index": 0.50},
    {"name": "Bidar", "lat": 17.9104, "lon": 77.5199, "population": 1720006, "urban_index": 0.42, "poverty_index": 0.48},
    {"name": "Chikballapur", "lat": 13.4355, "lon": 77.7277, "population": 1254631, "urban_index": 0.38, "poverty_index": 0.40},
    {"name": "Ramanagara", "lat": 12.7157, "lon": 77.2810, "population": 1082739, "urban_index": 0.42, "poverty_index": 0.38},
]

CRIME_TYPES = [
    {"type": "Theft", "base_rate": 0.28, "severity": "Medium"},
    {"type": "Robbery", "base_rate": 0.08, "severity": "High"},
    {"type": "Assault", "base_rate": 0.12, "severity": "High"},
    {"type": "Murder", "base_rate": 0.03, "severity": "Critical"},
    {"type": "Fraud", "base_rate": 0.10, "severity": "Medium"},
    {"type": "Cybercrime", "base_rate": 0.08, "severity": "Medium"},
    {"type": "Drug Trafficking", "base_rate": 0.06, "severity": "High"},
    {"type": "Kidnapping", "base_rate": 0.03, "severity": "Critical"},
    {"type": "Burglary", "base_rate": 0.10, "severity": "High"},
    {"type": "Vehicle Theft", "base_rate": 0.07, "severity": "Medium"},
    {"type": "Domestic Violence", "base_rate": 0.05, "severity": "High"},
]

MODUS_OPERANDI = [
    "Armed confrontation", "Pickpocketing", "Phone snatching", "Identity theft",
    "Phishing scam", "Housebreak at night", "Gang ambush", "Online fraud",
    "Drug supply chain", "Vehicle snatching", "Ransom demand", "Cheque fraud",
    "Social engineering", "Physical intimidation", "Nighttime burglary",
]

STATUS_OPTIONS = ["Solved", "Under Investigation", "Chargesheeted", "Closed", "Pending"]
STATUS_WEIGHTS = [0.35, 0.30, 0.15, 0.10, 0.10]

POLICE_STATIONS_TEMPLATE = [
    "Central PS", "North PS", "South PS", "East PS", "West PS",
    "Market PS", "Railway PS", "Industrial PS", "Rural PS", "Traffic PS",
]


def random_datetime_in_range(start: datetime, end: datetime) -> datetime:
    delta = end - start
    random_seconds = random.randint(0, int(delta.total_seconds()))
    return start + timedelta(seconds=random_seconds)


def jitter_location(lat: float, lon: float, radius_deg: float = 0.3):
    """Add random offset to lat/lon to spread incidents within a district."""
    angle = random.uniform(0, 2 * math.pi)
    distance = random.uniform(0, radius_deg)
    return (
        round(lat + distance * math.cos(angle), 6),
        round(lon + distance * math.sin(angle), 6),
    )


def generate_crimes(n: int = 5000, seed: int = 42) -> list[dict]:
    random.seed(seed)
    crimes = []
    start_date = datetime(2022, 1, 1)
    end_date = datetime(2024, 12, 31)

    # Assign offender pool
    offender_pool = [f"OFF-{str(i).zfill(4)}" for i in range(1, 301)]

    for i in range(n):
        district = random.choice(KARNATAKA_DISTRICTS)

        # Weight crime selection by district urbanization
        crime_weights = []
        for c in CRIME_TYPES:
            w = c["base_rate"]
            # Urban areas get more cybercrime/fraud, rural get more theft/assault
            if c["type"] in ["Cybercrime", "Fraud"] and district["urban_index"] > 0.6:
                w *= 1.8
            elif c["type"] in ["Assault", "Drug Trafficking"] and district["poverty_index"] > 0.45:
                w *= 1.5
            crime_weights.append(w)
        total = sum(crime_weights)
        crime_weights = [w / total for w in crime_weights]

        crime = random.choices(CRIME_TYPES, weights=crime_weights, k=1)[0]
        lat, lon = jitter_location(district["lat"], district["lon"])
        incident_dt = random_datetime_in_range(start_date, end_date)

        num_offenders = random.choices([1, 2, 3, 4], weights=[0.50, 0.30, 0.15, 0.05])[0]
        offender_ids = random.sample(offender_pool, num_offenders)

        crimes.append({
            "incident_id": f"INC-{str(i+1).zfill(5)}",
            "district": district["name"],
            "police_station": f"{district['name'].split()[0]} {random.choice(POLICE_STATIONS_TEMPLATE)}",
            "crime_type": crime["type"],
            "severity": crime["severity"],
            "date_time": incident_dt.isoformat(),
            "year": incident_dt.year,
            "month": incident_dt.month,
            "hour": incident_dt.hour,
            "day_of_week": incident_dt.strftime("%A"),
            "lat": lat,
            "lon": lon,
            "status": random.choices(STATUS_OPTIONS, weights=STATUS_WEIGHTS)[0],
            "victim_count": random.choices([1, 2, 3, 4, 5], weights=[0.55, 0.25, 0.12, 0.05, 0.03])[0],
            "offender_ids": offender_ids,
            "modus_operandi": random.choice(MODUS_OPERANDI),
            "urban_index": district["urban_index"],
            "poverty_index": district["poverty_index"],
            "population": district["population"],
        })

    return crimes


def get_district_stats(crimes: list[dict]) -> list[dict]:
    """Aggregate per-district crime statistics."""
    from collections import defaultdict

    stats = defaultdict(lambda: {
        "total_crimes": 0,
        "by_type": defaultdict(int),
        "by_month": defaultdict(int),
        "by_hour": defaultdict(int),
        "solved": 0,
        "critical": 0,
    })

    for crime in crimes:
        d = crime["district"]
        stats[d]["total_crimes"] += 1
        stats[d]["by_type"][crime["crime_type"]] += 1
        stats[d]["by_month"][f"{crime['year']}-{str(crime['month']).zfill(2)}"] += 1
        stats[d]["by_hour"][crime["hour"]] += 1
        if crime["status"] == "Solved":
            stats[d]["solved"] += 1
        if crime["severity"] == "Critical":
            stats[d]["critical"] += 1

    result = []
    for district_info in KARNATAKA_DISTRICTS:
        d_name = district_info["name"]
        s = stats[d_name]
        total = s["total_crimes"] or 1
        result.append({
            "district": d_name,
            "lat": district_info["lat"],
            "lon": district_info["lon"],
            "population": district_info["population"],
            "urban_index": district_info["urban_index"],
            "poverty_index": district_info["poverty_index"],
            "total_crimes": s["total_crimes"],
            "crimes_per_lakh": round(s["total_crimes"] / (district_info["population"] / 100000), 2),
            "solve_rate": round(s["solved"] / total * 100, 1),
            "critical_incidents": s["critical"],
            "by_type": dict(s["by_type"]),
            "by_month": dict(sorted(s["by_month"].items())),
            "by_hour": {str(k): v for k, v in sorted(s["by_hour"].items())},
        })

    return sorted(result, key=lambda x: x["total_crimes"], reverse=True)


if __name__ == "__main__":
    print("Generating crime data...")
    crimes = generate_crimes(5000)
    stats = get_district_stats(crimes)
    out = Path(__file__).parent
    with open(out / "crimes.json", "w") as f:
        json.dump(crimes, f, indent=2)
    with open(out / "district_stats.json", "w") as f:
        json.dump(stats, f, indent=2)
    print(f"Generated {len(crimes)} crimes across {len(stats)} districts.")
