import requests
import zipfile
from osgeo import ogr
from bs4 import BeautifulSoup

response = requests.get(f"https://data.cityofchicago.org/download/rytz-fq6y/"
                            "application%2Fvnd.google-earth.kmz")

with open('temp.kmz', 'wb') as f:
    f.write(response.content)
kmz = zipfile.ZipFile('temp.kmz', 'r')
kml = kmz.open('doc.kml', 'r').read()

# Parse the KML with BeautifulSoup
soup = BeautifulSoup(kml, 'xml')

# Find all the elements that contain HTML and remove them
for tag in soup.find_all():
    if tag.name not in ['kml', 'document', 'placemark', 'name', 'point', 'coordinates']:
        tag.decompose()

# Write the cleaned KML back to a file
with open('temp.kml', 'wb') as f:
    f.write(str(soup).encode())

kml_driver = ogr.GetDriverByName('KML')
kml_ds = kml_driver.Open('temp.kml')

# Though GeoJSON, the file extension must be .json for later manipulation
geojson_driver = ogr.GetDriverByName('GeoJSON')
geojson_driver.CopyDataSource(kml_ds, 'data/map.json')