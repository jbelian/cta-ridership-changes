import os
import json
import requests
from sodapy import Socrata

domain = "data.cityofchicago.org"
resource = "bynn-gwxy"
token = os.getenv('SOCRATA_TOKEN')
client = Socrata(domain, token)

try:
    with open('src/data/last_modified.txt', 'r') as f:
        last_modified = f.read().strip()
except FileNotFoundError:
    last_modified = None

response = requests.get(f"https://{domain}/resource/{resource}.json",
                         headers={"X-App-Token": token})

print(response)
print(response.headers)

if last_modified != response.headers.get('Last-Modified'):
    busData = client.get(resource, limit=100000)

    if not os.path.exists('src/data'):
        os.makedirs('src/data')

    with open('src/data/busData.json', 'w') as f:
        json.dump(busData, f)
    with open('src/data/last_modified.txt', 'w') as f:
        f.write(response.headers.get('Last-Modified')  or '')