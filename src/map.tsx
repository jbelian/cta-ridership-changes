import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { FeatureCollection } from "geojson";
import "leaflet/dist/leaflet.css";
import "./App.css";
import { jawgToken } from "./token.tsx";
import doc from "./data/doc.json";

function busLinePopup(feature: any, layer: any) {
  console.log(feature);
  layer.bindPopup(`This is the ${feature.properties.Name} bus line`);
}

export default function Map() {
  const docData = doc as FeatureCollection;
  return (
    <MapContainer className="map" center={[41.8781, -87.63]} zoom={13}>
      <TileLayer
        attribution='<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={`https://{s}.tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=${jawgToken}`}
      />
      <GeoJSON data={docData} onEachFeature={busLinePopup} />
    </MapContainer>
  );
}
