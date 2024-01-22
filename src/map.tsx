// map.tsx

import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import { Feature, FeatureCollection, Geometry } from "geojson";
import L from "leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import "./App.css";
import map from "../data/map.json";
import { CombinedRoutes } from "./busData.tsx";

const jawgToken = import.meta.env.VITE_APP_JAWG_TOKEN;

const Legend = () => {
  const map = useMap();

  useEffect(() => {
    const legend = new L.Control({ position: "topright" })

    const grades = [0, 10];
    const colors = ["#D6E8DD", "#C2E4EF"];

    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'info legend');
      for (let i = 0; i < grades.length; i++) {
        div.innerHTML += '<i style="background:' + colors[i] + '"></i> ' + grades[i];
      }
      return div;
    };

    legend.addTo(map);
  }, [map]);

  return null;
};

// Time complexity now improved to linear
const Map = ({ filteredRoutes, keyProp }:
  { filteredRoutes: CombinedRoutes[]; keyProp: string }) => {
  const filteredRoutesLookup = Object.fromEntries(filteredRoutes.map(route => [route.route, route]));

  const filteredRoutesSet = new Set(filteredRoutes.map(route => route.route));
  const matchingRoutes = {
    type: "FeatureCollection",
    features: map.features.filter((feature) =>
      filteredRoutesSet.has(feature.properties.ROUTE)
    ),
  } as FeatureCollection;

  function onEachFeature(feature: Feature<Geometry, any>, layer: any) {
    const color = setColor(feature);
    const { ROUTE, NAME } = feature.properties;
    const { percentChange, route, routename } = filteredRoutesLookup[ROUTE];

    function highlightFeature(e: any) {
      const layer = e.target;
      layer.bringToFront();
      layer.setStyle({
        weight: 5,
        color: "#7F0"
      });
    };

    function resetHighlight(e: any) {
      e.target.setStyle({
        weight: 3,
        color: color,
      });
    }

    // routename comes from bus data, and NAME comes from map data. They're not always the same.
    // Apparently, the CTA prefers the latter on their website, taking Route 146 as an example:
    // bus data: Inner Drive/Michigan Express
    // map data: INNER LAKE SHORE/MICHIGAN EXPRESS
    layer.on({ mouseover: highlightFeature, mouseout: resetHighlight });
    layer.bindTooltip(`Route ${route}<br/>${NAME}<br/>${percentChange}% change`,
      { sticky: true, direction: 'auto' });
    layer.setStyle({
      weight: 3,
      color: color,
    });
  }

  function setColor(feature: Feature<Geometry, any>) {
    const matchingRoute = filteredRoutesLookup[feature.properties.ROUTE];

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
      <Legend />
    </MapContainer>
  );
};

export default Map;
