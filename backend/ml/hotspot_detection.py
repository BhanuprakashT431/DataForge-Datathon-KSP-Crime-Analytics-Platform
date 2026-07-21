"""
ML: Spatial Hotspot Detection using DBSCAN clustering.
Identifies crime hotspot clusters across Karnataka districts.
"""

import json
import math
import random
from collections import defaultdict
from pathlib import Path


def haversine(lat1, lon1, lat2, lon2):
    """Distance in km between two lat/lon points."""
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    return R * 2 * math.asin(math.sqrt(a))


def dbscan(points, eps_km=15, min_samples=8):
    """
    Simplified DBSCAN for lat/lon crime points.
    eps_km: neighborhood radius in kilometers
    min_samples: minimum incidents to form a cluster
    """
    n = len(points)
    labels = [-1] * n  # -1 = noise
    cluster_id = 0
    visited = [False] * n

    def get_neighbors(idx):
        neighbors = []
        p = points[idx]
        for j, q in enumerate(points):
            if haversine(p["lat"], p["lon"], q["lat"], q["lon"]) <= eps_km:
                neighbors.append(j)
        return neighbors

    for i in range(n):
        if visited[i]:
            continue
        visited[i] = True
        neighbors = get_neighbors(i)

        if len(neighbors) < min_samples:
            labels[i] = -1  # noise
        else:
            # Expand cluster
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


def detect_hotspots(crimes: list[dict], max_points=800) -> list[dict]:
    """Run DBSCAN on sampled crime points and return cluster summaries."""
    random.seed(42)

    # Sample for performance (use up to max_points)
    sample = random.sample(crimes, min(max_points, len(crimes)))

    labels = dbscan(sample, eps_km=12, min_samples=6)

    # Group by cluster
    clusters = defaultdict(list)
    for idx, label in enumerate(labels):
        if label >= 0:
            clusters[label].append(sample[idx])

    hotspots = []
    for cluster_id, members in clusters.items():
        lats = [m["lat"] for m in members]
        lons = [m["lon"] for m in members]
        crime_types = [m["crime_type"] for m in members]
        severities = [m["severity"] for m in members]
        districts = list(set(m["district"] for m in members))

        # Dominant crime type
        type_counts = defaultdict(int)
        for ct in crime_types:
            type_counts[ct] += 1
        dominant_type = max(type_counts, key=lambda x: type_counts[x])

        # Intensity score (0–100)
        critical_count = severities.count("Critical")
        high_count = severities.count("High")
        intensity = min(100, int(
            len(members) * 3 +
            critical_count * 8 +
            high_count * 4
        ))

        hotspots.append({
            "cluster_id": cluster_id,
            "center_lat": round(sum(lats) / len(lats), 6),
            "center_lon": round(sum(lons) / len(lons), 6),
            "incident_count": len(members),
            "intensity": intensity,
            "dominant_crime": dominant_type,
            "crime_breakdown": dict(type_counts),
            "districts": districts,
            "alert_level": "Critical" if intensity >= 75 else ("High" if intensity >= 50 else "Medium"),
        })

    # Sort by intensity descending
    hotspots.sort(key=lambda x: x["intensity"], reverse=True)
    return hotspots


if __name__ == "__main__":
    data_dir = Path(__file__).parent.parent / "data"
    with open(data_dir / "crimes.json") as f:
        crimes = json.load(f)
    hotspots = detect_hotspots(crimes)
    with open(data_dir / "hotspots.json", "w") as f:
        json.dump(hotspots, f, indent=2)
    print(f"Detected {len(hotspots)} hotspot clusters.")
