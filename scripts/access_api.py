import os
import json
import requests
from sodapy import Socrata

# Constants
DOMAIN = "data.cityofchicago.org"
BUS_RESOURCE = "bynn-gwxy"
STATION_RESOURCE = "t2rn-p8d7"
GIST_ID = "cfe1d1c07128822245c55596e7e60971"

# API info for bus ridership data
os.makedirs('data', exist_ok=True)
socrata_token = os.getenv('SOCRATA_TOKEN')
client = Socrata(DOMAIN, socrata_token)

# Fetch the bus and station ridership data
bus_response = requests.get(f"https://{DOMAIN}/resource/{BUS_RESOURCE}.json",
                            headers={"X-App-Token": socrata_token})

station_response = requests.get(f"https://{DOMAIN}/resource/{STATION_RESOURCE}.json",
                              headers={"X-App-Token": socrata_token})
print("BUS RESPONSE:")
print(bus_response)
print(bus_response.headers)
print("STATION RESPONSE:")
print(station_response)
print(station_response.headers)

# Update the Gist with the time of the fetch
gist_update_token = os.getenv("GIST_UPDATE_TOKEN")
headers = {
    "Authorization": f"token {gist_update_token}",
    "Accept": "application/vnd.github.v3+json",
}
fetch_datetime = {
    "files": {
        "lastFetched.json": {
            "content": bus_response.headers.get('Date')
        }
    }
}

gist_response = requests.patch(f"https://api.github.com/gists/{GIST_ID}", headers=headers, json=fetch_datetime)
gist_response.raise_for_status()

# Read the last modified date from lastModified.json
try:
    with open('data/lastModified.json', 'r') as f:
        modified_datetime = json.load(f)
        last_modified = modified_datetime.get("lastModified")
        print("Current last modified time:", last_modified)
except FileNotFoundError:
    last_modified = None

# If the API header's 'Last-Modified' value hasn't changed, then this workflow ends here
response_lm = bus_response.headers.get('Last-Modified')
if last_modified == response_lm:
    print("Fetched last modified time:", response_lm)
    print("No new data found, exiting...")
    exit(0)

# Otherwise, the API has new data, so this workflow continues
else:
    last_modified = response_lm
    print(f"New data found! Time: {last_modified}")

    # Download the bus ridership data
    bus_data = client.get(BUS_RESOURCE, limit=10000000)
    with open('data/busData.json', 'w') as f:
        json.dump(bus_data, f)

    # Subtract 40000 from each station ridership ID to match the station map ID,
    # and download the station ridership data
    station_data = client.get(STATION_RESOURCE, limit=10000000)
    for item in station_data:
        item['station_id'] = str(int(item['station_id']) - 40000)
    with open('data/stationData.json', 'w') as f:
        json.dump(station_data, f)

    # That data's most recent month is used as the end date in the date selector
    last_month = max([item['month_beginning'][:7] for item in bus_data])
    
    # Write lastModified and lastMonth to lastModified.json
    # If these are updated, app will be re-deployed
    with open('data/lastModified.json', 'w') as f:
        json.dump({
            "lastModified": last_modified or '',
            "lastMonth": last_month
        }, f)