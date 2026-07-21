"""
ML: Predictive Risk Scoring for Karnataka Districts.
Multi-factor model that outputs per-district risk scores (0–100).
"""

import json
import math
from pathlib import Path


def normalize(value, min_val, max_val):
    if max_val == min_val:
        return 0.5
    return max(0, min(1, (value - min_val) / (max_val - min_val)))


def compute_risk_scores(crimes: list[dict], district_stats: list[dict]) -> list[dict]:
    """
    Risk Score = weighted combination of:
    - Crime rate per lakh population (35%)
    - Recent crime trend (30-day recency) (20%)
    - Critical incident ratio (15%)
    - Poverty index (15%)
    - Unsolved case rate (15%)
    """
    from collections import defaultdict

    # Extract recent crimes (last 6 months of data = 2024-07 to 2024-12)
    recent_counts = defaultdict(int)
    for crime in crimes:
        if crime["year"] == 2024 and crime["month"] >= 7:
            recent_counts[crime["district"]] += 1

    # Compute ranges for normalization
    all_rates = [d["crimes_per_lakh"] for d in district_stats]
    all_critical = [d["critical_incidents"] / max(d["total_crimes"], 1) for d in district_stats]
    all_unsolved = [1 - d["solve_rate"] / 100 for d in district_stats]
    all_poverty = [d["poverty_index"] for d in district_stats]
    all_recent = [recent_counts.get(d["district"], 0) for d in district_stats]

    results = []
    for d in district_stats:
        rate_score = normalize(d["crimes_per_lakh"], min(all_rates), max(all_rates))
        critical_ratio = d["critical_incidents"] / max(d["total_crimes"], 1)
        critical_score = normalize(critical_ratio, min(all_critical), max(all_critical))
        unsolved_score = normalize(1 - d["solve_rate"] / 100, min(all_unsolved), max(all_unsolved))
        poverty_score = normalize(d["poverty_index"], min(all_poverty), max(all_poverty))
        recent_score = normalize(recent_counts.get(d["district"], 0), min(all_recent), max(all_recent))

        weighted_score = (
            rate_score * 0.35 +
            recent_score * 0.20 +
            critical_score * 0.15 +
            poverty_score * 0.15 +
            unsolved_score * 0.15
        )

        risk_score = round(weighted_score * 100, 1)
        risk_level = "Critical" if risk_score >= 75 else ("High" if risk_score >= 55 else ("Medium" if risk_score >= 35 else "Low"))

        results.append({
            "district": d["district"],
            "lat": d["lat"],
            "lon": d["lon"],
            "risk_score": risk_score,
            "risk_level": risk_level,
            "factor_breakdown": {
                "crime_rate": round(rate_score * 100, 1),
                "recent_trend": round(recent_score * 100, 1),
                "critical_incidents": round(critical_score * 100, 1),
                "poverty_index": round(poverty_score * 100, 1),
                "unsolved_rate": round(unsolved_score * 100, 1),
            },
            "crimes_per_lakh": d["crimes_per_lakh"],
            "poverty_index": d["poverty_index"],
            "solve_rate": d["solve_rate"],
            "total_crimes": d["total_crimes"],
        })

    results.sort(key=lambda x: x["risk_score"], reverse=True)
    return results


def generate_monthly_forecast(district_stats: list[dict]) -> list[dict]:
    """
    Simple linear trend extrapolation for next 6 months.
    Uses last 12 months of monthly crime data to predict forward.
    """
    import random
    random.seed(7)
    forecasts = []

    for d in district_stats[:10]:  # Top 10 districts
        monthly = d.get("by_month", {})
        months = sorted(monthly.keys())[-12:]
        counts = [monthly[m] for m in months]
        if len(counts) < 3:
            continue

        # Simple moving average trend + noise
        avg = sum(counts) / len(counts)
        trend = (counts[-1] - counts[0]) / max(len(counts), 1)

        forecast_months = []
        for i in range(1, 7):
            predicted = max(0, avg + trend * i + random.gauss(0, avg * 0.08))
            forecast_months.append({
                "month": f"2025-{str(i).zfill(2)}",
                "predicted": round(predicted),
                "lower_bound": round(predicted * 0.85),
                "upper_bound": round(predicted * 1.15),
            })

        forecasts.append({
            "district": d["district"],
            "historical": [{"month": m, "count": monthly[m]} for m in months],
            "forecast": forecast_months,
        })

    return forecasts


if __name__ == "__main__":
    data_dir = Path(__file__).parent.parent / "data"
    with open(data_dir / "crimes.json") as f:
        crimes = json.load(f)
    with open(data_dir / "district_stats.json") as f:
        stats = json.load(f)
    risk = compute_risk_scores(crimes, stats)
    forecast = generate_monthly_forecast(stats)
    with open(data_dir / "risk_scores.json", "w") as f:
        json.dump(risk, f, indent=2)
    with open(data_dir / "forecasts.json", "w") as f:
        json.dump(forecast, f, indent=2)
    print(f"Computed risk scores for {len(risk)} districts.")
