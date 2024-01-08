import os
import json
import requests
from sodapy import Socrata

domain = "data.cityofchicago.org"
resource = "bynn-gwxy"
token = os.getenv('SOCRATA_TOKEN')
client = Socrata(domain, token)
limit = 3

last_modified_path = 'src/data/last_modified.txt'
bus_data_path = 'src/data/busData.json'
bus_data_dir = 'src/data'

try:
    with open(last_modified_path, 'r') as f:
        last_modified = f.read().strip()
except FileNotFoundError:
    last_modified = None

response = requests.get(f"https://{domain}/resource/{resource}.json",
                         headers={"X-App-Token": token})

print(response)
print(response.headers)

if last_modified != response.headers.get('Last-Modified'):
    busData = client.get(resource, limit=limit)

    if not os.path.exists(bus_data_dir):
        os.makedirs(bus_data_dir)

    with open(bus_data_path, 'w') as f:
        json.dump(busData, f)
    with open(last_modified_path, 'w') as f:
        f.write(response.headers.get('Last-Modified')  or '')