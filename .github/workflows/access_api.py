import os
import json
import requests
from sodapy import Socrata

os.makedirs('src/data', exist_ok=True)
domain = "data.cityofchicago.org"
token = os.getenv('SOCRATA_TOKEN')
client = Socrata(domain, token)

response = requests.get(f"https://{domain}/resource/bynn-gwxy.json",
                         headers={"X-App-Token": token})

print(response)
print(response.headers)

try:
    with open('src/data/last_modified.txt', 'r') as f:
        last_modified = f.read().strip()
except FileNotFoundError:
    last_modified = None
if last_modified != response.headers.get('Last-Modified'):

    with open('src/data/bus.json', 'w') as f:
        json.dump(client.get('bynn-gwxy', limit=100000), f)
    with open('src/data/last_modified.txt', 'w') as f:
        f.write(response.headers.get('Last-Modified') or '')