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
  const matchingRoutes = {
    type: "FeatureCollection",
    features: doc.features.filter((feature) =>
      filteredRoutes.some((route) => route.route === feature.properties.ROUTE)
    ),
  } as FeatureCollection;

  // Temporarily displaying routes as random colors
  const style = () => ({
    color: `#${Math.random().toString(16).slice(2, 8).toUpperCase()}`,
    weight: 5,
    opacity: 0.9,
  });

  return (
    <MapContainer center={[41.8781, -87.63]} zoom={13}>
      <TileLayer
        attribution='<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={`https://{s}.tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=${jawgToken}`}
      />
      <GeoJSON
        key={keyProp}
        data={matchingRoutes}
        style={style}
        onEachFeature={busLinePopup}
      />
    </MapContainer>
  );
};

export default Map;
