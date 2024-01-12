import requests
import zipfile
import subprocess
from bs4 import BeautifulSoup
import json

response = requests.get(f"https://data.cityofchicago.org/download/rytz-fq6y/"
                            "application%2Fvnd.google-earth.kmz")

with open('temp.kmz', 'wb') as f:
    f.write(response.content)
kmz = zipfile.ZipFile('temp.kmz', 'r')
kml = kmz.open('doc.kml', 'r').read()
with open('temp.kml', 'wb') as f:
    f.write(kml)

# Use ogr2ogr to convert KML to GeoJSON
subprocess.run(['ogr2ogr', '-f', 'GeoJSON', 'data/map.json', 'temp.kml'])

# Load the GeoJSON file
with open('data/map.json', 'r') as f:
    data = json.load(f)

# Iterate over the features and clean the HTML from the 'description' field
for feature in data['features']:
    soup = BeautifulSoup(feature['properties']['description'], 'html.parser')
    feature['properties']['description'] = soup.get_text()

    # Parse properties from the 'description' field
    for table in soup.find_all('table'):
        for row in table.find_all('tr'):
            cells = row.find_all('td')
            if len(cells) == 2:
                prop = cells[0].get_text().strip()
                value = cells[1].get_text().strip()
                feature['properties'][prop] = value

# Write the cleaned data back to the file
with open('data/map.json', 'w') as f:
    json.dump(data, f)