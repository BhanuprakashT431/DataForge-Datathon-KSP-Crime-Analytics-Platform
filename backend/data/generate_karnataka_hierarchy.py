import json
import random
import os
import math

# Real Karnataka Districts & Taluks
KARNATAKA_TALUKS = {
    "Bengaluru Urban": ["Bengaluru North", "Bengaluru South", "Bengaluru East", "Yelahanka", "Anekal"],
    "Bengaluru Rural": ["Devanahalli", "Doddaballapura", "Hoskote", "Nelamangala"],
    "Mysuru": ["Mysuru", "Nanjangud", "Hunsur", "Periyapatna", "T Narasipura", "K R Nagar", "H D Kote", "Saragur"],
    "Mandya": ["Mandya", "Maddur", "Malavalli", "Pandavapura", "Srirangapatna", "K.R. Pet", "Nagamangala"],
    "Belagavi": ["Belagavi", "Bailhongal", "Chikodi", "Gokak", "Khanapur", "Raybag", "Ramdurg", "Athani", "Saundatti"],
    "Tumakuru": ["Tumakuru", "Gubbi", "Kunigal", "Madhugiri", "Pavagada", "Sira", "Tiptur", "Turuvekere", "Chikkanayakanahalli", "Koratagere"],
    "Shivamogga": ["Shivamogga", "Bhadravati", "Hosanagara", "Sagara", "Shikaripura", "Soraba", "Thirthahalli"],
    "Dharwad": ["Dharwad", "Hubballi", "Kalghatgi", "Kundgol", "Navalgund"],
    "Kalaburagi": ["Kalaburagi", "Afzalpur", "Aland", "Chincholi", "Chitapur", "Jevargi", "Sedam"],
    "Raichur": ["Raichur", "Devadurga", "Lingsugur", "Manvi", "Sindhanur"],
    "Kodagu": ["Madikeri", "Somwarpet", "Virajpet"],
    "Udupi": ["Udupi", "Kundapura", "Karkala", "Byndoor", "Brahmavara", "Kaup"],
    "Dakshina Kannada": ["Mangaluru", "Bantwal", "Puttur", "Sullia", "Belthangady", "Moodabidri", "Kadaba"],
    "Ballari": ["Ballari", "Kurugodu", "Siruguppa", "Kampli", "Sandur"],
    "Hassan": ["Hassan", "Alur", "Arakalagud", "Arsikere", "Belur", "Channarayapatna", "Holenarasipura", "Sakleshpur"],
    "Bagalkote": ["Bagalkote", "Badami", "Hunagunda", "Ilkal", "Jamkhandi", "Mudhol", "Bilagi"],
    "Bidar": ["Bidar", "Basavakalyan", "Bhalki", "Homnabad", "Aurad"],
    "Chamarajanagar": ["Chamarajanagar", "Gundlupet", "Kollegal", "Yelandur", "Hanur"],
    "Chikkaballapur": ["Chikkaballapur", "Bagepalli", "Chintamani", "Gauribidanur", "Gudibanda", "Sidlaghatta"],
    "Chikkamagaluru": ["Chikkamagaluru", "Kadur", "Koppa", "Mudigere", "Narasimharajapura", "Sringeri", "Tarikere", "Ajampura"],
    "Chitradurga": ["Chitradurga", "Challakere", "Hiriyur", "Holalkere", "Hosadurga", "Molakalmuru"],
    "Davanagere": ["Davanagere", "Harihar", "Honnali", "Channagiri", "Jagalur", "Nyamathi"],
    "Gadag": ["Gadag", "Mundargi", "Nargund", "Ron", "Shirhatti"],
    "Haveri": ["Haveri", "Byadgi", "Hangal", "Hirekerur", "Ranebennur", "Savanur", "Shiggaon"],
    "Koppal": ["Koppal", "Gangawati", "Kushtagi", "Yelburga"],
    "Ramanagara": ["Ramanagara", "Channapatna", "Kanakapura", "Magadi"],
    "Uttara Kannada": ["Karwar", "Ankola", "Bhatkal", "Haliyal", "Honnavar", "Joida", "Kumta", "Mundgod", "Siddapur", "Sirsi", "Yellapur"],
    "Vijayapura": ["Vijayapura", "Basavana Bagevadi", "Indi", "Muddebihal", "Sindagi"],
    "Yadgir": ["Yadgir", "Shahapur", "Shorapur"],
    "Vijayanagara": ["Hosapete", "Hagaribommanahalli", "Harapanahalli", "Hoovina Hadagali", "Kotturu", "Kudligi"]
}

# If any district is missing from the geojson mapping, we'll assign generic taluks
def get_taluks_for_district(dist_name):
    for k, v in KARNATAKA_TALUKS.items():
        if k.lower() in dist_name.lower():
            return v
    return [f"{dist_name} Central", f"{dist_name} North", f"{dist_name} South", f"{dist_name} East", f"{dist_name} West"]

VILLAGES_LIST = ["Gandhinagar", "Vidyanagar", "Shantinagar", "Jayanagar", "Ashoknagar", "Kuvempunagar", "Saraswatipuram", "Rajarajeshwarinagar", "Basaveshwaranagar", "Malleshwaram"]
CRIME_TYPES = ["Cyber Crime", "Robbery", "Assault", "Financial Fraud", "Organized Syndicate", "Drug Trafficking", "Public Disturbance"]
SEVERITY_LEVELS = ["Critical", "High", "Medium", "Low"]

def generate_offset(radius=0.1):
    angle = random.uniform(0, 2 * math.pi)
    r = radius * math.sqrt(random.uniform(0, 1))
    return r * math.cos(angle), r * math.sin(angle)

def generate_hierarchy():
    geojson_path = os.path.join('frontend', 'public', 'data', 'karnataka_districts.geojson')
    with open(geojson_path, 'r') as f:
        geojson = json.load(f)
        
    hierarchy = {}
    
    # Calculate a rough center for each district from GeoJSON
    for feature in geojson['features']:
        dist_name = feature['properties']['district']
        coords = feature['geometry']['coordinates']
        
        # Flatten coords to get bounds
        flat_coords = []
        def flatten(lst):
            if type(lst[0]) in (float, int):
                flat_coords.append(lst)
            else:
                for item in lst:
                    flatten(item)
        flatten(coords)
        
        min_lon = min(p[0] for p in flat_coords)
        max_lon = max(p[0] for p in flat_coords)
        min_lat = min(p[1] for p in flat_coords)
        max_lat = max(p[1] for p in flat_coords)
        
        center_lon = (min_lon + max_lon) / 2
        center_lat = (min_lat + max_lat) / 2
        
        district_radius = min((max_lon - min_lon) / 2, (max_lat - min_lat) / 2)
        
        taluks_names = get_taluks_for_district(dist_name)
        taluks = {}
        
        for t_name in taluks_names:
            dx, dy = generate_offset(district_radius * 0.7)
            t_lat = center_lat + dy
            t_lon = center_lon + dx
            
            villages = {}
            num_villages = random.randint(3, 6)
            sampled_villages = random.sample(VILLAGES_LIST, min(num_villages, len(VILLAGES_LIST)))
            
            for v_idx, v_name in enumerate(sampled_villages):
                v_dx, v_dy = generate_offset(district_radius * 0.2)
                v_lat = t_lat + v_dy
                v_lon = t_lon + v_dx
                
                # Generate Level 5 assets inside village
                stations = []
                for s in range(random.randint(1, 2)):
                    s_dx, s_dy = generate_offset(0.02)
                    stations.append({
                        "id": f"PS-{dist_name[:3].upper()}-{random.randint(100,999)}",
                        "type": "Police Station",
                        "name": f"{v_name} {random.choice(['Town', 'Rural', 'Traffic'])} PS",
                        "lat": v_lat + s_dy,
                        "lon": v_lon + s_dx,
                        "officer": f"Inspector {random.randint(10,99)}",
                        "active_firs": random.randint(5, 50),
                        "patrol_strength": random.randint(2, 10)
                    })
                
                hotspots = []
                for h in range(random.randint(3, 8)):
                    h_dx, h_dy = generate_offset(0.02)
                    hotspots.append({
                        "id": f"FIR-{random.randint(1000, 9999)}",
                        "type": "Hotspot",
                        "lat": v_lat + h_dy,
                        "lon": v_lon + h_dx,
                        "crime_type": random.choice(CRIME_TYPES),
                        "severity": random.choice(SEVERITY_LEVELS),
                        "time_logged": f"{random.randint(0,23):02d}:00 HRS",
                        "suspect_linked": random.choice([True, False])
                    })
                
                assets = []
                for a in range(random.randint(2, 5)):
                    a_dx, a_dy = generate_offset(0.02)
                    assets.append({
                        "id": f"AST-{random.randint(100,999)}",
                        "type": random.choice(["Patrol", "CCTV", "Evidence"]),
                        "lat": v_lat + a_dy,
                        "lon": v_lon + a_dx
                    })
                
                risk = random.randint(30, 95)
                villages[f"{t_name} {v_name}"] = {
                    "lat": v_lat,
                    "lon": v_lon,
                    "risk_score": risk,
                    "threat_level": "Critical" if risk > 85 else ("High" if risk > 70 else "Medium"),
                    "stations": stations,
                    "hotspots": hotspots,
                    "assets": assets
                }
                
            taluks[t_name] = {
                "lat": t_lat,
                "lon": t_lon,
                "villages": villages,
                "total_firs": sum(len(v["hotspots"]) for v in villages.values())
            }
            
        dist_risk = random.randint(40, 95)
        hierarchy[dist_name] = {
            "lat": center_lat,
            "lon": center_lon,
            "risk_score": dist_risk,
            "threat_level": "Critical" if dist_risk > 85 else ("High" if dist_risk > 70 else "Medium"),
            "taluks": taluks
        }

    output_path = os.path.join('frontend', 'public', 'data', 'karnataka_hierarchy.json')
    with open(output_path, 'w') as f:
        json.dump(hierarchy, f, indent=2)
    print(f"Successfully wrote hierarchical data to {output_path}")

if __name__ == "__main__":
    generate_hierarchy()
