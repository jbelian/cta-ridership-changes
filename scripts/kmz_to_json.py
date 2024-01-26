import requests
import zipfile
import subprocess
from bs4 import BeautifulSoup
import json

def kmz_to_json(url, output_file):
    # Download the KMZ file and extract the KML inside
    response = requests.get(url)
    with open('temp.kmz', 'wb') as f:
        f.write(response.content)
    kmz = zipfile.ZipFile('temp.kmz', 'r')
    kml = kmz.open('doc.kml', 'r').read()
    with open('temp.kml', 'wb') as f:
        f.write(kml)

    # Use ogr2ogr to convert KML to GeoJSON
    subprocess.run(['ogr2ogr', '-f', 'GeoJSON', output_file, 'temp.kml'])
    with open(output_file, 'r') as f:
        data = json.load(f)
    return data

def clean_properties(data, properties):
    for feature in data['features']:
        # Extract the HTML description
        soup = BeautifulSoup(feature['properties']['description'], 'html.parser')

        # Extract the specified properties from the HTML content
        extracted_props = {}
        for prop in properties:
            value = soup.find(text=prop).find_next('td').text
            extracted_props[prop] = value

        # Replace the feature's properties with the extracted properties
        feature['properties'] = extracted_props

# Call the functions with the provided URLs
bus_map_data = kmz_to_json("https://data.cityofchicago.org/download/rytz-fq6y/"
                    "application%2Fvnd.google-earth.kmz", "output1.json")
rail_map_data = kmz_to_json("https://data.cityofchicago.org/download/sgbp-qafc/"
                    "application%2Fvnd.google-earth.kmz", "output2.json")
station_map_data = kmz_to_json("https://data.cityofchicago.org/download/4qtv-9w43/"
                           "application%2Fvnd.google-earth.kmz", "output3.json")


# After cleaning, each feature's full 'properties' field is shown below
# That's unnecessary, as only the parameters specified are needed for now

#  "Name": "111A",
#  "description": "a bunch of gibberish",
#  "altitudeMode": "clampToGround",
#  "tessellate": 1,
#  "extrude": 0,
#  "visibility": -1,
#  "snippet": "",
#  "ROUTE": "111A",
#  "ROUTE0": "111A",
#  "NAME": "PULLMAN SHUTTLE",
#  "WKDAY": "1",
#  "SAT": "1",
#  "SUN": "1",
#  "SHAPE.LEN": "19392.594684"
clean_properties(bus_map_data, ['ROUTE', 'NAME'])


# "Name": "Brown, Green, Orange, Pink, Purple (Exp)",
# "LINES": "Brown, Green, Orange, Pink, Purple (Exp)",
# "DESCRIPTIO": "Clark/Lake to State/Lake",
# "TYPE": "Elevated or at Grade",
# "LEGEND": "ML",
# "ALT_LEGEND": "L4",
# "BRANCH": "Loop Elevated",
# "OWL": "No",
# "SHAPE": "Polyline",
# "SHAPE.LEN": "830.774585",
# "altitudeMode": "clampToGround",
# "tessellate": 1,
# "extrude": 0,
# "visibility": -1,
# "snippet": ""
clean_properties(rail_map_data, ['LEGEND', 'ALT_LEGEND'])

# "Name": "Clark/Lake",
# "Station ID": "380",
# "Station Name": "Clark/Lake",
# "Rail Line": "Brown, Orange, Pink, Purple (Express), Green, Blue",
# "Address": "100 W. Lake",
# "ADA": "ADA Accessible",
# "Park and Ride": "No",
# "POINT_X": "1175525.859134",
# "POINT_Y": "1901735.36642",
# "altitudeMode": "clampToGround",
# "tessellate": -1,
# "extrude": 0,
# "visibility": -1,
# "snippet": ""
clean_properties(station_map_data, ['Station ID', 'Station Name'])

# Save the cleaned GeoJSON data
with open('data/busMap.json', 'w') as f:
    json.dump(bus_map_data, f)
with open('data/railMap.json', 'w') as f:
    json.dump(rail_map_data, f)
with open('data/stationMap.json', 'w') as f:
    json.dump(station_map_data, f)