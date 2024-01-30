// map.tsx

import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import { Feature, FeatureCollection, Geometry } from "geojson";
import L from "leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import "./App.css";
import RailLines from './railLines.tsx'
import stationMap from '../data/stationMap.json';
import busMap from '../data/busMap.json';
import { CombinedBoardings } from '../utils/dataHandlers.tsx';

const jawgToken = import.meta.env.VITE_APP_JAWG_TOKEN;

// Colorblind friendly colors for -100% to 100% derived from
// "sunset" color scheme here https://personal.sron.nl/~pault/
// Hot pink added for exponential tail of numbers above 100%
const colorThresholds = [
  { threshold: 500, color: "#aa4499" },
  { threshold: 354, color: "#934599" },
  { threshold: 251, color: "#7c4799" },
  { threshold: 178, color: "#64489a" },
  { threshold: 126, color: "#4d4a9a" },
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
      const grades = [500, 354, 251, 178, 126, 95, 85, 75, 65, 55, 45, 35, 25, 15, 5, 0, -5, -15, -25, -35, -45, -55, -65, -75, -85, -95];
      const text = ["1000%", "", "", "", "", "100%", "", "", "", "", "50%", "", "", "", "", "0%", "", "", "", "", "-50%", "", "", "", "", "-100%"]
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

const Map = ({ keyProp, toggleTransitData, boardings }:
  { boardings: CombinedBoardings[]; keyProp: string; toggleTransitData: boolean }) => {
  const boardingsPairs = boardings.map(boarding => { return [boarding["id"], boarding]; });
  const boardingsLookup = Object.fromEntries(boardingsPairs);
  const boardingsSet = new Set(
    boardings
      .filter(boarding => boarding.percentChange && boarding.percentChange.trim() !== '')
      .map(boarding => boarding.id)
  );

  const boardingsMap = toggleTransitData ? busMap : stationMap;
  const mapID = toggleTransitData ? "ROUTE" : "Station ID";
  const matchingBoardings = {
    type: "FeatureCollection",
    features: boardingsMap.features.filter((feature) =>
      boardingsSet.has(String((feature.properties as any)[mapID]))
    ),
  } as FeatureCollection;

  function onEachBoarding(feature: Feature<Geometry, any>, layer: any) {
    const mapID = feature.properties[toggleTransitData ? "ROUTE" : "Station ID"];
    const color = setColor(feature);
    if (!boardingsLookup[mapID]) { return }
    const { name, percentChange, monthTotal2 } = boardingsLookup[mapID];

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

    layer.on({ mouseover: highlightFeature, mouseout: resetHighlight });
    layer.bindTooltip(`${name}<br/>${monthTotal2} boardings<br/>${percentChange}% change`,
      { sticky: true, direction: 'auto' });
    layer.setStyle({
      weight: 3,
      color: color,
    });
  }

  function setColor(feature: Feature<Geometry, any>) {
    const mapID = feature.properties[toggleTransitData ? "ROUTE" : "Station ID"];
    const matchingBoarding = boardingsLookup[mapID];
    if (!matchingBoarding) { return "#000" }

    const percentChange = parseFloat(matchingBoarding.percentChange);
    const colorThreshold = colorThresholds.find(threshold => percentChange >= threshold.threshold);
    return colorThreshold ? colorThreshold.color : "#FFF";
  }

  if (!boardings || boardings.length === 0) { return <div>Loading...</div> }

  return (
    <MapContainer center={[41.8781, -87.63]} zoom={13}>
      <TileLayer
        attribution='&copy; <a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank"><b>Jawg</b>Maps</a> 
                    &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={`https://{s}.tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=${jawgToken}`}
      />
      {!toggleTransitData && <RailLines />}
      <GeoJSON
        key={keyProp}
        data={matchingBoardings}
        pointToLayer={(feature, latlng) => {
          const mapID = feature.properties[toggleTransitData ? "ROUTE" : "Station ID"];
          const matchingBoarding = boardingsLookup[mapID];
          let radius = 8;
          if (matchingBoarding && matchingBoarding.monthTotal2) {
            radius = Math.sqrt(parseFloat(matchingBoarding.monthTotal2)) * .03;
          }
          return L.circleMarker(latlng, {
            radius: radius,
            fillColor: setColor(feature),
            color: "#0F0",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8,
          });
        }}
        onEachFeature={onEachBoarding}
      />
      <Legend />
    </MapContainer>
  );
};

export default Map;