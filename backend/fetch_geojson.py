import urllib.request
import json
import os
import ssl

# geoBoundaries India Districts (ADM2)
url = "https://raw.githubusercontent.com/wmgeolab/geoBoundaries/main/releaseData/gbOpen/IND/ADM2/geoBoundaries-IND-ADM2.geojson"
output_path = r"c:\Users\DELL\Downloads\Datathon\frontend\public\data\karnataka_districts.geojson"

os.makedirs(os.path.dirname(output_path), exist_ok=True)

# List of Karnataka Districts (various spellings might exist, using standard ones)
ka_districts = {
    "bengaluru urban", "bangalore", "bangalore urban", "bengaluru rural", "bangalore rural",
    "mysuru", "mysore", "hubballi-dharwad", "dharwad", "mangaluru", "dakshina kannada",
    "belagavi", "belgaum", "kalaburagi", "gulbarga", "ballari", "bellary", "tumakuru", "tumkur",
    "shivamogga", "shimoga", "davanagere", "hassan", "mandya", "kodagu", "udupi",
    "raichur", "bidar", "koppal", "bagalkote", "bagalkot", "gadag", "haveri", "yadgir",
    "vijayapura", "bijapur", "chamarajanagar", "kolar", "chikkaballapur", "chikkamagaluru", "chikmagalur",
    "ramanagara", "uttara kannada", "vijayanagara", "chitradurga"
}

try:
    print("Downloading India GeoJSON from geoBoundaries...")
    # Bypass SSL verification if needed
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, context=ctx) as response:
        data = json.loads(response.read().decode('utf-8'))
        
    print("Filtering for Karnataka districts...")
    ka_features = []
    for f in data.get('features', []):
        shape_name = f.get('properties', {}).get('shapeName', '').lower()
        if shape_name in ka_districts:
            # Clean up properties
            f['properties'] = {'district': f['properties'].get('shapeName')}
            ka_features.append(f)
            
    data['features'] = ka_features
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f)
        
    print(f"Successfully saved {len(ka_features)} districts to {output_path}")
    print([f['properties']['district'] for f in ka_features])
except Exception as e:
    print(f"Error: {e}")
