"""
ML: Anomaly Detection using statistical Z-score analysis.
Identifies unusual spike patterns based on the official ER schema CaseMaster data.
"""

import math
from collections import defaultdict
from typing import List, Dict, Any
import datetime
from .explainable_ai import ExplainableAIFramework

def compute_mean_std(values: list[float]):
    if len(values) < 2:
        return 0, 1
    n = len(values)
    mean = sum(values) / n
    variance = sum((v - mean) ** 2 for v in values) / (n - 1)
    return mean, math.sqrt(variance)

def detect_anomalies(cases: List[Dict[str, Any]], units: List[Dict[str, Any]]) -> dict:
    unit_to_dist = {u["UnitID"]: u["DistrictID"] for u in units}

    # 1. Monthly spike detection per district
    monthly_counts = defaultdict(lambda: defaultdict(int))
    for case in cases:
        # CrimeRegisteredDate is a string in format 'YYYY-MM-DD' from model_dump() usually or datetime.date
        dt = case["CrimeRegisteredDate"]
        if isinstance(dt, str):
            dt = datetime.datetime.strptime(dt, "%Y-%m-%d").date()
        
        district_id = unit_to_dist.get(case["PoliceStationID"], 0)
        key = f"{dt.year}-{str(dt.month).zfill(2)}"
        monthly_counts[district_id][key] += 1

    spike_alerts = []
    for district, monthly in monthly_counts.items():
        sorted_months = sorted(monthly.items())
        counts = [v for _, v in sorted_months]
        mean, std = compute_mean_std(counts)
        for month, count in sorted_months:
            z_score = (count - mean) / (std + 1e-6)
            if z_score > 2.0:
                reason = f"Monthly crime volume ({count}) exceeded historical average ({mean:.1f}) by {z_score:.1f} standard deviations."
                xai_payload = ExplainableAIFramework.wrap_prediction(
                    prediction="Volume Anomaly Detected",
                    confidence=min(0.99, 0.7 + (z_score * 0.05)),
                    reason=reason,
                    evidence=[f"Z-Score: {z_score:.2f}", f"Historical Mean: {mean:.1f}"],
                    algorithm="Z-Score Statistical Anomaly",
                    feature_importance={"monthly_volume": 1.0},
                    recommended_action="Deploy immediate strategic review of district resource allocation."
                )
                
                spike_alerts.append({
                    "type": "Monthly Spike",
                    "district": district,
                    "period": month,
                    "count": count,
                    "z_score": round(z_score, 2),
                    "xai": xai_payload
                })

    spike_alerts.sort(key=lambda x: x["z_score"], reverse=True)

    return {
        "spike_alerts": spike_alerts[:20],
        "total_anomalies": len(spike_alerts)
    }
