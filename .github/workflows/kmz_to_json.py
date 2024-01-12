import requests
import zipfile
import subprocess

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