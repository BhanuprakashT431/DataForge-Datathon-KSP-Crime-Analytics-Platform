"""
ML: Temporal Trend Analysis.
Detects emerging crime trends, seasonal patterns, and time-of-day distributions.
"""

import json
from collections import defaultdict
from pathlib import Path


def analyze_trends(crimes: list[dict]) -> dict:
    # --- Crime by year ---
    yearly = defaultdict(lambda: defaultdict(int))
    for c in crimes:
        yearly[c["year"]][c["crime_type"]] += 1

    yearly_trend = [
        {"year": yr, **dict(types)} for yr, types in sorted(yearly.items())
    ]

    # --- Crime by hour of day (all types) ---
    hourly = defaultdict(int)
    hourly_by_type = defaultdict(lambda: defaultdict(int))
    for c in crimes:
        hourly[c["hour"]] += 1
        hourly_by_type[c["crime_type"]][c["hour"]] += 1

    hourly_dist = [{"hour": h, "count": hourly.get(h, 0)} for h in range(24)]

    # --- Day of week pattern ---
    dow = defaultdict(int)
    dow_order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    for c in crimes:
        dow[c["day_of_week"]] += 1
    dow_dist = [{"day": d, "count": dow.get(d, 0)} for d in dow_order]

    # --- Monthly trend by crime type (last 24 months) ---
    monthly_by_type = defaultdict(lambda: defaultdict(int))
    for c in crimes:
        key = f"{c['year']}-{str(c['month']).zfill(2)}"
        monthly_by_type[c["crime_type"]][key] += 1

    top_crimes = ["Theft", "Assault", "Robbery", "Fraud", "Drug Trafficking", "Cybercrime", "Burglary"]
    monthly_series = []
    for ctype in top_crimes:
        series = []
        for month in sorted(monthly_by_type[ctype].keys()):
            series.append({"month": month, "count": monthly_by_type[ctype][month]})
        monthly_series.append({"crime_type": ctype, "data": series[-24:]})

    # --- Heatmap: district × crime_type ---
    district_type_matrix = defaultdict(lambda: defaultdict(int))
    for c in crimes:
        district_type_matrix[c["district"]][c["crime_type"]] += 1

    heatmap = []
    for district, types in district_type_matrix.items():
        for ctype, count in types.items():
            heatmap.append({"district": district, "crime_type": ctype, "count": count})

    # --- Season analysis ---
    seasons = {"Winter": [12, 1, 2], "Spring": [3, 4, 5], "Summer": [6, 7, 8], "Autumn": [9, 10, 11]}
    season_counts = defaultdict(int)
    for c in crimes:
        for season, months in seasons.items():
            if c["month"] in months:
                season_counts[season] += 1
    season_dist = [{"season": s, "count": season_counts[s]} for s in ["Winter", "Spring", "Summer", "Autumn"]]

    return {
        "yearly_trend": yearly_trend,
        "hourly_distribution": hourly_dist,
        "day_of_week": dow_dist,
        "monthly_by_crime_type": monthly_series,
        "district_crime_heatmap": heatmap,
        "season_distribution": season_dist,
    }


if __name__ == "__main__":
    data_dir = Path(__file__).parent.parent / "data"
    with open(data_dir / "crimes.json") as f:
        crimes = json.load(f)
    trends = analyze_trends(crimes)
    with open(data_dir / "trends.json", "w") as f:
        json.dump(trends, f, indent=2)
    print("Trend analysis complete.")
