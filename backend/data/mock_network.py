"""
Criminal Network Data Generator.
Generates offender profiles, victim nodes, and relationship edges for
the force-directed network graph visualization.
"""

import json
import random
from pathlib import Path

random.seed(99)

FIRST_NAMES_M = ["Ravi", "Suresh", "Mahesh", "Ramesh", "Nagaraj", "Kiran", "Arjun", "Vijay",
                  "Sanjay", "Rakesh", "Deepak", "Shankar", "Pavan", "Ganesh", "Rajesh",
                  "Anil", "Vinod", "Manoj", "Santosh", "Harish", "Lokesh", "Naveen", "Pradeep"]
FIRST_NAMES_F = ["Priya", "Suma", "Lakshmi", "Kavitha", "Rekha", "Anitha", "Savitha", "Meena",
                  "Usha", "Geetha", "Radha", "Sudha", "Pushpa", "Nirmala", "Vijayalakshmi"]
LAST_NAMES = ["Kumar", "Gowda", "Reddy", "Nayak", "Patil", "Naik", "Rao", "Hegde",
               "Shetty", "Bhat", "Murthy", "Raju", "Swamy", "Naidu", "Pillai", "Sharma"]

CRIME_TYPES = ["Theft", "Robbery", "Assault", "Murder", "Fraud", "Cybercrime",
                "Drug Trafficking", "Kidnapping", "Burglary", "Vehicle Theft"]

DISTRICTS = [
    "Bangalore Urban", "Mysuru", "Belagavi", "Kalaburagi", "Ballari",
    "Tumkur", "Dharwad", "Shivamogga", "Raichur", "Vijayapura",
    "Davangere", "Dakshina Kannada", "Bidar", "Hassan", "Mandya",
]

MODUS_OPERANDI_TYPES = [
    "Armed Robbery", "Pickpocketing", "Online Fraud", "Drug Supply",
    "Extortion", "Vehicle Snatching", "Housebreaking", "Identity Theft",
    "Gang Violence", "Human Trafficking",
]

GANG_NAMES = [
    "Mysuru Network", "KGF Syndicate", "Border Cartel", "Coastal Gang",
    "North Karnataka Cell", "Cyber Ring Alpha", "Gold Theft Crew",
    "Vehicle Racket", "Extortion Web", "Drug Supply Chain",
]


def random_name(gender="M"):
    first = random.choice(FIRST_NAMES_M if gender == "M" else FIRST_NAMES_F)
    last = random.choice(LAST_NAMES)
    return f"{first} {last}"


def generate_offenders(n: int = 200) -> list[dict]:
    offenders = []
    for i in range(n):
        gender = random.choices(["M", "F"], weights=[0.82, 0.18])[0]
        age = random.randint(18, 65)
        num_incidents = random.choices([1, 2, 3, 4, 5, 6, 7, 8], weights=[0.30, 0.25, 0.18, 0.12, 0.07, 0.04, 0.02, 0.02])[0]
        num_districts = random.randint(1, min(5, num_incidents))
        risk = min(100, int(
            num_incidents * 9 +
            random.uniform(5, 20) +
            (20 if num_districts > 3 else 0)
        ))

        offenders.append({
            "id": f"OFF-{str(i+1).zfill(4)}",
            "type": "offender",
            "name": random_name(gender),
            "gender": gender,
            "age": age,
            "primary_crime": random.choice(CRIME_TYPES),
            "modus_operandi": random.choice(MODUS_OPERANDI_TYPES),
            "districts_active": random.sample(DISTRICTS, num_districts),
            "num_incidents": num_incidents,
            "risk_score": risk,
            "gang_affiliation": random.choice(GANG_NAMES) if random.random() < 0.35 else None,
            "years_active": random.randint(1, 12),
            "bail_status": random.choice(["In Custody", "Out on Bail", "Absconding", "Convicted"]),
            "incident_ids": [f"INC-{random.randint(1, 5000):05d}" for _ in range(num_incidents)],
        })
    return offenders


def generate_victims(n: int = 80) -> list[dict]:
    victims = []
    for i in range(n):
        gender = random.choices(["M", "F"], weights=[0.55, 0.45])[0]
        victims.append({
            "id": f"VIC-{str(i+1).zfill(4)}",
            "type": "victim",
            "name": random_name(gender),
            "gender": gender,
            "age": random.randint(15, 75),
            "district": random.choice(DISTRICTS),
            "crime_type": random.choice(CRIME_TYPES),
            "incident_ids": [f"INC-{random.randint(1, 5000):05d}" for _ in range(random.randint(1, 3))],
        })
    return victims


def generate_location_nodes(n: int = 30) -> list[dict]:
    location_types = ["Hotel", "Market", "Bus Stand", "Railway Station", "Bar", "ATM",
                       "Industrial Area", "Slum Area", "Border Checkpoint", "Highway Junction"]
    locations = []
    for i in range(n):
        locations.append({
            "id": f"LOC-{str(i+1).zfill(3)}",
            "type": "location",
            "name": f"{random.choice(DISTRICTS).split()[0]} {random.choice(location_types)}",
            "district": random.choice(DISTRICTS),
            "crime_count": random.randint(3, 45),
        })
    return locations


def generate_edges(offenders: list, victims: list, locations: list) -> list[dict]:
    edges = []
    edge_id = 1

    # Offender ↔ Offender (gang associations)
    for i, off in enumerate(offenders):
        if off["gang_affiliation"]:
            gang_members = [o for o in offenders if o.get("gang_affiliation") == off["gang_affiliation"] and o["id"] != off["id"]]
            for assoc in random.sample(gang_members, min(len(gang_members), random.randint(1, 3))):
                edges.append({
                    "id": f"E-{edge_id:05d}",
                    "source": off["id"],
                    "target": assoc["id"],
                    "relation": "Gang Associate",
                    "weight": random.randint(1, 5),
                })
                edge_id += 1

    # Offender → Victim
    for off in offenders:
        num_victims = random.randint(0, min(3, off["num_incidents"]))
        for vic in random.sample(victims, min(num_victims, len(victims))):
            edges.append({
                "id": f"E-{edge_id:05d}",
                "source": off["id"],
                "target": vic["id"],
                "relation": "Perpetrator",
                "crime_type": off["primary_crime"],
                "weight": 3,
            })
            edge_id += 1

    # Offender → Location (crime scene)
    for off in random.sample(offenders, min(120, len(offenders))):
        loc = random.choice(locations)
        edges.append({
            "id": f"E-{edge_id:05d}",
            "source": off["id"],
            "target": loc["id"],
            "relation": "Crime Scene",
            "weight": 2,
        })
        edge_id += 1

    return edges


def generate_network():
    offenders = generate_offenders(200)
    victims = generate_victims(80)
    locations = generate_location_nodes(30)
    edges = generate_edges(offenders, victims, locations)

    nodes = offenders + victims + locations

    # Summary stats
    gang_counts = {}
    for o in offenders:
        if o["gang_affiliation"]:
            gang_counts[o["gang_affiliation"]] = gang_counts.get(o["gang_affiliation"], 0) + 1

    return {
        "nodes": nodes,
        "edges": edges,
        "stats": {
            "total_offenders": len(offenders),
            "total_victims": len(victims),
            "total_locations": len(locations),
            "total_edges": len(edges),
            "gang_sizes": gang_counts,
            "high_risk_offenders": [o for o in offenders if o["risk_score"] >= 70],
        }
    }


if __name__ == "__main__":
    print("Generating criminal network data...")
    network = generate_network()
    out = Path(__file__).parent
    with open(out / "network.json", "w") as f:
        json.dump(network, f, indent=2)
    print(f"Generated {len(network['nodes'])} nodes, {len(network['edges'])} edges.")
