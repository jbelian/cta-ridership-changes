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

const colorThresholds = [
  { threshold: 90, color: "#364B9A" },
  { threshold: 80, color: "#4063A8" },
  { threshold: 70, color: "#4A7BB7" },
  { threshold: 60, color: "#5C90C2" },
  { threshold: 50, color: "#6EA6CD" },
  { threshold: 40, color: "#83B8D7" },
  { threshold: 30, color: "#98CAE1" },
  { threshold: 20, color: "#ADD7E8" },
  { threshold: 10, color: "#C2E4EF" },
  { threshold: 0.001, color: "#D6E8DD" },
  { threshold: 0, color: "#EAECCC" },
  { threshold: -10, color: "#F4E3AB" },
  { threshold: -20, color: "#FEDA8B" },
  { threshold: -30, color: "#FDC678" },
  { threshold: -40, color: "#FDB366" },
  { threshold: -50, color: "#F99858" },
  { threshold: -60, color: "#F67E4B" },
  { threshold: -70, color: "#E95D3C" },
  { threshold: -80, color: "#DD3D2D" },
  { threshold: -90, color: "#C11E29" },
  { threshold: -100, color: "#A50026" },
];

const Legend = () => {
  const map = useMap();

  useEffect(() => {
    const legend = new L.Control({ position: "topright" })
    function getColor(d: number) {
      const colorThreshold = colorThresholds.find(threshold => d >= threshold.threshold);
      return colorThreshold ? colorThreshold.color : "#FFFFFF";
    }
    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend");
      const grades = [95, 85, 75, 65, 55, 45, 35, 25, 15, 5, 0, -5, -15, -25, -35, -45, -55, -65, -75, -85, -95];
      const text = ["100%", "", "", "", "", "50%", "", "", "", "", "0%", "", "", "", "", "-50%", "", "", "", "", "-100%"]
      const labels = grades.map((grade, i) =>
        '<div style="line-height: 14px;"><i style="background:' + getColor(grade) +
        '; width: 13px; height: 13px; display: inline-block; vertical-align: top;"></i> ' + text[i] + '</div>'
      );
      div.innerHTML = labels.join("");
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

    // routename can also be destructured here if desired
    const { percentChange, route } = filteredRoutesLookup[ROUTE];

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

    const percentChange = parseFloat(matchingRoute.percentChange);
    const colorThreshold = colorThresholds.find(threshold => percentChange >= threshold.threshold);
    return colorThreshold ? colorThreshold.color : "#FFFFFF";
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
