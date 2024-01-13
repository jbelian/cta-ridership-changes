import os
import json
import requests
from sodapy import Socrata

# API info for bus ridership data
os.makedirs('data', exist_ok=True)
domain = "data.cityofchicago.org"
token = os.getenv('SOCRATA_TOKEN')
client = Socrata(domain, token)
response = requests.get(f"https://{domain}/resource/bynn-gwxy.json",
                         headers={"X-App-Token": token})

print(response)
print(response.headers)

try:
    with open('data/lastModified.json', 'r') as f:
        data = json.load(f)
        last_modified = data.get("Last modified")
except FileNotFoundError:
    last_modified = None

# If the header's 'Last-Modified' value hasn't changed, then this workflow ends here
response_lm = response.headers.get('Last-Modified')
if last_modified != response_lm:
    last_modified = response_lm

    # Download the bus ridership data    
    data = client.get('bynn-gwxy', limit=100000)
    with open('data/bus.json', 'w') as f:
        json.dump(data, f)

    # The most recent month will be used as the end date in the date selector
    last_month = max([item['month_beginning'][:7] for item in data])
    last_fetch = response.headers.get('Date')
    with open('data/lastModified.json', 'w') as f:
        json.dump({
            "lastFetched": last_fetch or '',
            "lastModified": last_modified or '',
            "lastMonth": last_month
        }, f)