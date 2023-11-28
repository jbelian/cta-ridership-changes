// map.tsx

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { FeatureCollection } from "geojson";
import "leaflet/dist/leaflet.css";
import "./App.css";
import { jawgToken } from "./token.tsx";
import doc from "./data/doc.json";
import { CombinedRoutes } from "./busData.tsx";

const busLinePopup = (feature: any, layer: any) => {
  layer.bindPopup(`Bus line ${feature.properties.Name}`);
};

const Map = ({
  filteredRoutes,
  keyProp,
}: {
  filteredRoutes: CombinedRoutes[];
  keyProp: string;
}) => {
  const matchingRoutes = doc.features.filter((feature) =>
    filteredRoutes.some((route) => route.route === feature.properties.ROUTE)
  );
  //
  console.log(matchingRoutes);
  // TOMORROW: FIGURE OUT WHY MATCHING ROUTES DOES NOT TAKE THE SET OF COMBINED ROUTES

  return (
    <MapContainer center={[41.8781, -87.63]} zoom={13}>
      <TileLayer
        attribution='<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={`https://{s}.tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=${jawgToken}`}
      />
      <GeoJSON
        key={keyProp}
        data={
          {
            type: "FeatureCollection",
            features: matchingRoutes,
          } as FeatureCollection
        }
        onEachFeature={busLinePopup}
      />
    </MapContainer>
  );
};

export default Map;
