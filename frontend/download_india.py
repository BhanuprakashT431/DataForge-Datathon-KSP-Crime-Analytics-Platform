import urllib.request
import json

url = "https://raw.githubusercontent.com/Subhash9325/GeoJson-Data-of-Indian-States/master/Indian_States"
output_file = "public/data/india_states.geojson"

try:
    with urllib.request.urlopen(url) as response:
        data = json.loads(response.read().decode())
        with open(output_file, 'w') as f:
            json.dump(data, f)
    print("Successfully downloaded india_states.geojson")
except Exception as e:
    print(f"Error: {e}")
