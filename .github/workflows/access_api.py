import os
import json
import requests
from sodapy import Socrata

# API info for bus ridership data
os.makedirs('data', exist_ok=True)
domain = "data.cityofchicago.org"
socrata_token = os.getenv('SOCRATA_TOKEN')
client = Socrata(domain, socrata_token)
socrata_response = requests.get(f"https://{domain}/resource/bynn-gwxy.json",
                         headers={"X-App-Token": socrata_token})
print(socrata_response)
print(socrata_response.headers)


# Update the Gist with the time of the fetch
gist_id = "cfe1d1c07128822245c55596e7e60971"
gist_update_token = os.getenv("GIST_UPDATE_TOKEN")
headers = {
    "Authorization": f"token {gist_update_token}",
    "Accept": "application/vnd.github.v3+json",
}
data = {
    "files": {
        "lastFetched.json": {
            "content": socrata_response.headers.get('Date')
        }
    }
}

gist_response = requests.patch(f"https://api.github.com/gists/{gist_id}", headers=headers, json=data)
gist_response.raise_for_status()


# Read the last modified date from lastModified.json
try:
    with open('data/lastModified.json', 'r') as f:
        data = json.load(f)
        last_modified = data.get("lastModified")
        print("Current last modified time:", last_modified)
except FileNotFoundError:
    last_modified = None

# If the API header's 'Last-Modified' value hasn't changed, then this workflow ends here
response_lm = socrata_response.headers.get('Last-Modified')
if last_modified == response_lm:
    print("Fetched last modified time:", response_lm)
    print("No new data found, exiting...")
    exit(0)

last_modified = response_lm
print(f"New data found! {last_modified}")

# Download the bus ridership data    
data = client.get('bynn-gwxy', limit=1000000)
with open('data/bus.json', 'w') as f:
    json.dump(data, f)

# That data's most recent month is used as the end date in the date selector
last_month = max([item['month_beginning'][:7] for item in data])

# Write lastModified and lastMonth to lastModified.json
# If these are updated, app will be re-deployed
with open('data/lastModified.json', 'w') as f:
    json.dump({
        "lastModified": last_modified or '',
        "lastMonth": last_month
    }, f)