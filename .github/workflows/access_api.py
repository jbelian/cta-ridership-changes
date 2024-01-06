import os
import json
import requests
from sodapy import Socrata

domain = "data.cityofchicago.org"
resource = "bynn-gwxy"
token = os.getenv('SOCRATA_TOKEN')
client = Socrata(domain, token)
bus_data = client.get("bynn-gwxy", limit=50000)

last_modified_path = '.github/workflows/lastModified.txt'
bus_data_path = 'src/data/busData.json'

try:
    with open(last_modified_path, 'r') as f:
        last_modified = f.read().strip()
except FileNotFoundError:
    last_modified = None

response = requests.head(f"https://{domain}/resource/{resource}.json",
                         headers={"X-App-Token": token})

if last_modified != response.headers.get('Last-Modified'):
    bus_data = client.get(resource, limit=50000)
    with open(bus_data_path, 'w') as f:
        json.dump(bus_data, f)
    with open(bus_data_path, 'w') as f:
        f.write(response.headers.get('Last-Modified'))

with open('src/data/bus_data.json', 'w') as f:
    json.dump(bus_data, f)