import os
import json
from sodapy import Socrata

domain = "data.cityofchicago.org"
token = os.getenv('SOCRATA_TOKEN')
client = Socrata(domain, token)
bus_data = client.get("bynn-gwxy", limit=50000)

with open('src/data/bus_data.json', 'w') as f:
    json.dump(bus_data, f)