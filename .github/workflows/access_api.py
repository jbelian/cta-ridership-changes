import os
import json
from sodapy import Socrata

domain = "data.cityofchicago.org"
token = os.getenv('SOCRATA_TOKEN')
client = Socrata(domain, token)
results = client.get("bynn-gwxy", limit=50000)

with open('results.json', 'w') as f:
    json.dump(results, f)