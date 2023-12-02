// map.tsx

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { FeatureCollection } from "geojson";
import "leaflet/dist/leaflet.css";
import "./App.css";
import { jawgToken } from "./token.tsx";
import doc from "./data/doc.json";
import { CombinedRoutes } from "./busData.tsx";

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

  function onEachFeature(feature: any, layer: any) {
    // layer.bindPopup(`Bus line ${feature.properties.Name}`);
    if (feature.properties) {
      const { Name, NAME2 } = feature.properties;
      layer.bindTooltip(`${Name}, ${NAME2}`, {
        sticky: true,
      });
    }

    layer.setStyle({
      weight: 4,
      fillColor: "#FFF",
    });
  }

  return (
    <MapContainer center={[41.8781, -87.63]} zoom={13}>
      <TileLayer
        attribution='<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={`https://{s}.tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=${jawgToken}`}
      />
      <GeoJSON
        key={keyProp}
        data={matchingRoutes}
        onEachFeature={onEachFeature}
      />
    </MapContainer>
  );
};

export default Map;
