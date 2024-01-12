// map.tsx

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { Feature, FeatureCollection, Geometry } from "geojson";
import "leaflet/dist/leaflet.css";
import "./App.css";
import { jawgToken } from "./token.tsx";
import map from "../data/map.json";
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
    features: map.features.filter((feature) =>
      filteredRoutes.some((route) => route.route === feature.properties.ROUTE)
    ),
  } as FeatureCollection;

  function onEachFeature(feature: Feature<Geometry, any>, layer: any) {
    const color = setColor(feature);
    layer.bindPopup(
      `Route ${feature.properties.ROUTE}`
    );
    if (feature.properties) {
      const { ROUTE, NAME } = feature.properties;
      // layer.bringToFront;
      layer.bindTooltip(`Route ${ROUTE}<br/>${NAME}`, {
        sticky: true,
      });
    }
    layer.setStyle({
      weight: 3,
      color: color,
      fillOpacity: 1,
    });
  }

  function setColor(feature: Feature<Geometry, any>) {
    const matchingRoute = filteredRoutes.find(
      (route) => route.route === feature.properties.ROUTE
    );

    if (!matchingRoute || !matchingRoute.percentChange) return;

    // This heatmap is derived from the colorblind-friendly "Sunset" color scheme
    // https://personal.sron.nl/~pault/
    const percentChange = parseFloat(matchingRoute.percentChange);
    switch (true) {
      case percentChange >= 90: return "#364B9A";
      case percentChange >= 80: return "#4063A8";
      case percentChange >= 70: return "#4A7BB7";
      case percentChange >= 60: return "#5C90C2";
      case percentChange >= 50: return "#6EA6CD";
      case percentChange >= 40: return "#83B8D7";
      case percentChange >= 30: return "#98CAE1";
      case percentChange >= 20: return "#ADD7E8";
      case percentChange >= 10: return "#C2E4EF";
      case percentChange > 0: return "#D6E8DD";
      case percentChange < -90: return "#A50026";
      case percentChange < -80: return "#C11E29";
      case percentChange < -70: return "#DD3D2D";
      case percentChange < -60: return "#E95D3C";
      case percentChange < -50: return "#F67E4B";
      case percentChange < -40: return "#F99858";
      case percentChange < -30: return "#FDB366";
      case percentChange < -20: return "#FDC678";
      case percentChange < -10: return "#FEDA8B";
      case percentChange < 0: return "#F4E3AB";
      case percentChange == 0: return "#EAECCC";
      default: return "#FFFFFF";
    }
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
