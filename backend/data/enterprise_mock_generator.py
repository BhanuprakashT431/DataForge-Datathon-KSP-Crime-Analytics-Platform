import json
import random
import uuid
import os
from datetime import datetime, timedelta

def generate_dataset():
    # configuration
    NUM_FIRS = 10000
    NUM_ACCUSED = 6000
    NUM_VICTIMS = 8000
    NUM_WITNESSES = 3000
    NUM_OFFICERS = 2000
    NUM_VEHICLES = 1500
    NUM_WEAPONS = 1000
    NUM_PHONES = 2500
    NUM_BANKS = 2000
    NUM_GANGS = 100

    districts = [
        {"name": "Bengaluru Urban", "lat": 12.9716, "lng": 77.5946, "population": 9621551, "area": 2196, "literacy_rate": 87.67, "urbanization": 90.94, "crime_index": 0.8},
        {"name": "Bengaluru Rural", "lat": 13.2917, "lng": 77.5610, "population": 990923, "area": 2298, "literacy_rate": 77.93, "urbanization": 27.12, "crime_index": 0.5},
        {"name": "Mysuru", "lat": 12.2958, "lng": 76.6394, "population": 3001127, "area": 6854, "literacy_rate": 72.79, "urbanization": 41.50, "crime_index": 0.6},
        {"name": "Hubballi-Dharwad", "lat": 15.3647, "lng": 75.1240, "population": 1847023, "area": 4260, "literacy_rate": 80.00, "urbanization": 56.82, "crime_index": 0.65},
        {"name": "Mangaluru", "lat": 12.9141, "lng": 74.8560, "population": 2089649, "area": 4770, "literacy_rate": 88.57, "urbanization": 47.67, "crime_index": 0.55},
        {"name": "Belagavi", "lat": 15.8497, "lng": 74.4977, "population": 4779661, "area": 13415, "literacy_rate": 73.48, "urbanization": 25.45, "crime_index": 0.45},
        {"name": "Kalaburagi", "lat": 17.3297, "lng": 76.8343, "population": 2566326, "area": 10951, "literacy_rate": 64.85, "urbanization": 32.55, "crime_index": 0.7},
        {"name": "Ballari", "lat": 15.1394, "lng": 76.9214, "population": 2452595, "area": 8447, "literacy_rate": 67.43, "urbanization": 37.52, "crime_index": 0.6},
    ]

    stations = []
    station_names = ["Koramangala PS", "Indiranagar PS", "Central PS", "North PS", "South PS"]
    for d in districts:
        # Give 3-5 realistic PS
        num_ps = random.randint(3, 5)
        for sn in station_names[:num_ps]:
            stations.append({
                "id": str(uuid.uuid4()),
                "name": f"{sn} ({d['name']})",
                "district": d['name'],
                "lat": d['lat'] + random.uniform(-0.05, 0.05),
                "lng": d['lng'] + random.uniform(-0.05, 0.05)
            })

    people = []
    for _ in range(NUM_ACCUSED + NUM_VICTIMS + NUM_WITNESSES + NUM_OFFICERS):
        people.append({
            "id": str(uuid.uuid4()),
            "name": "Person_" + str(uuid.uuid4())[:8],
            "age": random.randint(18, 65)
        })
    
    accused_ids = [p['id'] for p in people[:NUM_ACCUSED]]
    victim_ids = [p['id'] for p in people[NUM_ACCUSED:NUM_ACCUSED+NUM_VICTIMS]]
    witness_ids = [p['id'] for p in people[NUM_ACCUSED+NUM_VICTIMS:NUM_ACCUSED+NUM_VICTIMS+NUM_WITNESSES]]
    
    firs = []
    for _ in range(NUM_FIRS):
        firs.append({
            "id": str(uuid.uuid4()),
            "station_id": random.choice(stations)["id"],
            "date": (datetime.now() - timedelta(days=random.randint(0, 365))).isoformat(),
            "description": "Crime incident description",
            "accused": random.sample(accused_ids, random.randint(1, 3)),
            "victims": random.sample(victim_ids, random.randint(1, 2))
        })

    network_edges = []
    for _ in range(50000):
        network_edges.append({
            "source": random.choice(accused_ids),
            "target": random.choice(accused_ids),
            "type": "ASSOCIATE"
        })

    dataset = {
        "districts": districts,
        "stations": stations,
        "firs": firs,
        "people": people,
        "network_edges": network_edges
    }

    output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "enterprise_ksp_dataset.json")
    with open(output_path, "w") as f:
        json.dump(dataset, f, indent=2)
    print(f"Generated successfully: {output_path}")
    
if __name__ == "__main__":
    generate_dataset()
