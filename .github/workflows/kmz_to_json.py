import requests
import zipfile
from osgeo import ogr

response = requests.get(f"https://data.cityofchicago.org/download/rytz-fq6y/"
                            "application%2Fvnd.google-earth.kmz")

with open('temp.kmz', 'wb') as f:
    f.write(response.content)
kmz = zipfile.ZipFile('temp.kmz', 'r')
kml = kmz.open('doc.kml', 'r').read()
with open('temp.kml', 'wb') as f:
    f.write(kml)
kml_driver = ogr.GetDriverByName('KML')
kml_ds = kml_driver.Open('temp.kml')

# Though GeoJSON, the file extension must be .json for later manipulation
geojson_driver = ogr.GetDriverByName('GeoJSON')
geojson_driver.CopyDataSource(kml_ds, 'data/map.json')