"""
ML: Anomaly Detection using statistical Z-score analysis.
Identifies districts/crime-types with unusual spike patterns.
"""

import json
import math
from collections import defaultdict
from pathlib import Path


def compute_mean_std(values: list[float]):
    if len(values) < 2:
        return 0, 1
    n = len(values)
    mean = sum(values) / n
    variance = sum((v - mean) ** 2 for v in values) / (n - 1)
    return mean, math.sqrt(variance)


def detect_anomalies(crimes: list[dict]) -> dict:
    """
    Detects anomalies in:
    1. Monthly crime spikes per district (Z-score > 2.0)
    2. Sudden emergence of a new crime type in a district
    3. Unusual night-time crime patterns
    """

    # --- 1. Monthly spike detection per district ---
    monthly_counts = defaultdict(lambda: defaultdict(int))
    for crime in crimes:
        key = f"{crime['year']}-{str(crime['month']).zfill(2)}"
        monthly_counts[crime["district"]][key] += 1

    spike_alerts = []
    for district, monthly in monthly_counts.items():
        sorted_months = sorted(monthly.items())
        counts = [v for _, v in sorted_months]
        mean, std = compute_mean_std(counts)
        for month, count in sorted_months:
            z_score = (count - mean) / (std + 1e-6)
            if z_score > 2.0:
                spike_alerts.append({
                    "type": "Monthly Spike",
                    "district": district,
                    "period": month,
                    "count": count,
                    "mean": round(mean, 1),
                    "z_score": round(z_score, 2),
                    "severity": "Critical" if z_score > 3.0 else "High",
                    "message": f"{district}: {count} crimes in {month} (avg {mean:.0f}, z={z_score:.1f}σ)",
                })

    spike_alerts.sort(key=lambda x: x["z_score"], reverse=True)

    # --- 2. Crime type emergence anomalies ---
    type_by_district_year = defaultdict(lambda: defaultdict(lambda: defaultdict(int)))
    for crime in crimes:
        type_by_district_year[crime["district"]][crime["crime_type"]][crime["year"]] += 1

    emergence_alerts = []
    for district, crime_types in type_by_district_year.items():
        for ctype, year_counts in crime_types.items():
            years = sorted(year_counts.keys())
            if len(years) >= 2:
                counts = [year_counts[y] for y in years]
                if counts[-1] > counts[-2] * 2.0 and counts[-1] >= 10:
                    growth = round((counts[-1] - counts[-2]) / (counts[-2] + 1) * 100, 1)
                    emergence_alerts.append({
                        "type": "Crime Type Surge",
                        "district": district,
                        "crime_type": ctype,
                        "previous_year": counts[-2],
                        "current_year": counts[-1],
                        "growth_pct": growth,
                        "severity": "High" if growth < 200 else "Critical",
                        "message": f"{ctype} in {district} surged {growth}% YoY ({counts[-2]} → {counts[-1]})",
                    })

    # --- 3. Night-time anomaly (crimes 22:00–04:00) ---
    night_by_district = defaultdict(lambda: {"night": 0, "total": 0})
    for crime in crimes:
        night_by_district[crime["district"]]["total"] += 1
        if crime["hour"] >= 22 or crime["hour"] <= 4:
            night_by_district[crime["district"]]["night"] += 1

    night_rates = [(d, v["night"] / (v["total"] + 1)) for d, v in night_by_district.items()]
    all_rates = [r for _, r in night_rates]
    mean_rate, std_rate = compute_mean_std(all_rates)

    night_alerts = []
    for district, rate in night_rates:
        z = (rate - mean_rate) / (std_rate + 1e-6)
        if z > 1.8:
            night_alerts.append({
                "type": "Night Crime Pattern",
                "district": district,
                "night_crime_rate": round(rate * 100, 1),
                "avg_rate": round(mean_rate * 100, 1),
                "z_score": round(z, 2),
                "severity": "Medium",
                "message": f"{district}: {rate*100:.0f}% crimes at night (avg {mean_rate*100:.0f}%)",
            })

    return {
        "spike_alerts": spike_alerts[:20],
        "emergence_alerts": sorted(emergence_alerts, key=lambda x: x["growth_pct"], reverse=True)[:15],
        "night_alerts": sorted(night_alerts, key=lambda x: x["z_score"], reverse=True)[:10],
        "total_anomalies": len(spike_alerts) + len(emergence_alerts) + len(night_alerts),
    }


if __name__ == "__main__":
    data_dir = Path(__file__).parent.parent / "data"
    with open(data_dir / "crimes.json") as f:
        crimes = json.load(f)
    anomalies = detect_anomalies(crimes)
    with open(data_dir / "anomalies.json", "w") as f:
        json.dump(anomalies, f, indent=2)
    print(f"Detected {anomalies['total_anomalies']} total anomalies.")
