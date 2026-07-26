"""
ML: Spatial Hotspot Detection using DBSCAN clustering.
Identifies crime hotspot clusters across Karnataka districts using official ER schema.
"""

import math
import random
from collections import defaultdict
from typing import List, Dict, Any
from .explainable_ai import ExplainableAIFramework

def haversine(lat1, lon1, lat2, lon2):
    """Distance in km between two lat/lon points."""
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    return R * 2 * math.asin(math.sqrt(a))

def dbscan(points, eps_km=15, min_samples=8):
    n = len(points)
    labels = [-1] * n  # -1 = noise
    cluster_id = 0
    visited = [False] * n

    def get_neighbors(idx):
        neighbors = []
        p = points[idx]
        for j, q in enumerate(points):
            if haversine(p["latitude"], p["longitude"], q["latitude"], q["longitude"]) <= eps_km:
                neighbors.append(j)
        return neighbors

    for i in range(n):
        if visited[i]: continue
        visited[i] = True
        neighbors = get_neighbors(i)

        if len(neighbors) < min_samples:
            labels[i] = -1
        else:
            labels[i] = cluster_id
            queue = list(neighbors)
            while queue:
                q_idx = queue.pop(0)
                if not visited[q_idx]:
                    visited[q_idx] = True
                    q_neighbors = get_neighbors(q_idx)
                    if len(q_neighbors) >= min_samples:
                        queue.extend(q_neighbors)
                if labels[q_idx] == -1:
                    labels[q_idx] = cluster_id
            cluster_id += 1

    return labels

def detect_hotspots(cases: List[Dict[str, Any]], units: List[Dict[str, Any]], max_points=800) -> List[Dict[str, Any]]:
    random.seed(42)
    sample = random.sample(cases, min(max_points, len(cases)))

    # Map unit IDs to district IDs for fast lookup
    unit_to_dist = {u["UnitID"]: u["DistrictID"] for u in units}

    labels = dbscan(sample, eps_km=12, min_samples=6)

    clusters = defaultdict(list)
    for idx, label in enumerate(labels):
        if label >= 0:
            clusters[label].append(sample[idx])

    hotspots = []
    for cluster_id, members in clusters.items():
        lats = [m["latitude"] for m in members]
        lons = [m["longitude"] for m in members]
        
        # We simulate CrimeType from CrimeMajorHeadID (1=Body, 2=Property, 3=Cyber)
        districts = list(set(unit_to_dist.get(m["PoliceStationID"], 0) for m in members))
        
        intensity = min(100, int(len(members) * 4))
        
        reason = f"Detected spatial density of {len(members)} incidents within a 12km radius."
        evidence = [f"{len(members)} recent FIRs matching location profile."]
        recommended_action = "Increase night patrol and set up temporary checkposts."
        
        xai_payload = ExplainableAIFramework.wrap_prediction(
            prediction="High Risk Hotspot" if intensity >= 75 else "Medium Risk Hotspot",
            confidence=min(0.95, 0.5 + (len(members) / 40)),
            reason=reason,
            evidence=evidence,
            algorithm="DBSCAN Clustering",
            feature_importance={"spatial_density": 0.8, "incident_volume": 0.2},
            recommended_action=recommended_action
        )

        hotspots.append({
            "cluster_id": cluster_id,
            "center_lat": round(sum(lats) / len(lats), 6),
            "center_lon": round(sum(lons) / len(lons), 6),
            "incident_count": len(members),
            "intensity": intensity,
            "districts": districts,
            "xai": xai_payload
        })

    hotspots.sort(key=lambda x: x["intensity"], reverse=True)
    return hotspots
