import json
import os

# Base Karnataka districts with approximate center lat/lons
districts = [
  {"name": "Bengaluru Urban", "lat": 12.9716, "lon": 77.5946},
  {"name": "Mysuru", "lat": 12.2958, "lon": 76.6394},
  {"name": "Hubballi-Dharwad", "lat": 15.3647, "lon": 75.1240},
  {"name": "Mangaluru", "lat": 12.9141, "lon": 74.8560},
  {"name": "Belagavi", "lat": 15.8497, "lon": 74.4977},
  {"name": "Kalaburagi", "lat": 17.3297, "lon": 76.8343},
  {"name": "Ballari", "lat": 15.1394, "lon": 76.9214},
  {"name": "Tumakuru", "lat": 13.3392, "lon": 77.1016},
  {"name": "Shivamogga", "lat": 13.9299, "lon": 75.5681},
  {"name": "Davanagere", "lat": 14.4644, "lon": 75.9218},
  {"name": "Hassan", "lat": 13.0033, "lon": 76.1004},
  {"name": "Mandya", "lat": 12.5218, "lon": 76.8951},
  {"name": "Kodagu", "lat": 12.3375, "lon": 75.8069},
  {"name": "Udupi", "lat": 13.3409, "lon": 74.7421},
  {"name": "Raichur", "lat": 16.2076, "lon": 77.3463},
  {"name": "Bidar", "lat": 17.9104, "lon": 77.5199},
  {"name": "Koppal", "lat": 15.3417, "lon": 76.1554},
  {"name": "Bagalkote", "lat": 16.1691, "lon": 75.6615},
  {"name": "Gadag", "lat": 15.4289, "lon": 75.6425},
  {"name": "Haveri", "lat": 14.7951, "lon": 75.3991},
  {"name": "Yadgir", "lat": 16.7672, "lon": 77.1352},
  {"name": "Vijayapura", "lat": 16.8302, "lon": 75.7100},
  {"name": "Chamarajanagar", "lat": 11.9261, "lon": 76.9400},
  {"name": "Kolar", "lat": 13.1367, "lon": 78.1292},
  {"name": "Chikkaballapur", "lat": 13.4325, "lon": 77.7275},
  {"name": "Chikkamagaluru", "lat": 13.3161, "lon": 75.7720},
  {"name": "Ramanagara", "lat": 12.7214, "lon": 77.2796},
  {"name": "Uttara Kannada", "lat": 14.8192, "lon": 74.8361},
  {"name": "Dharwad", "lat": 15.4589, "lon": 75.0078},
  {"name": "Vijayanagara", "lat": 15.2750, "lon": 76.3889},
  {"name": "Bengaluru Rural", "lat": 13.2505, "lon": 77.6322},
  {"name": "Chitradurga", "lat": 14.2251, "lon": 76.3980}
]

features = []
offset = 0.35  # approximately 30-40km bounds

for d in districts:
    lat = d["lat"]
    lon = d["lon"]
    name = d["name"]
    
    # Create a synthetic rectangular polygon for the district
    # To prevent massive overlap but cover the map, we use offset
    polygon = [
        [
            [lon - offset, lat - offset],
            [lon + offset, lat - offset],
            [lon + offset, lat + offset],
            [lon - offset, lat + offset],
            [lon - offset, lat - offset] # close the loop
        ]
    ]
    
    feature = {
        "type": "Feature",
        "properties": {
            "district": name
        },
        "geometry": {
            "type": "Polygon",
            "coordinates": polygon
        }
    }
    features.append(feature)

geojson = {
    "type": "FeatureCollection",
    "features": features
}

output_path = r"c:\Users\DELL\Downloads\Datathon\frontend\public\data\karnataka_districts.geojson"
os.makedirs(os.path.dirname(output_path), exist_ok=True)

with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(geojson, f)
    
print(f"Generated synthetic geojson with {len(features)} districts at {output_path}")
