import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import { Feature, FeatureCollection, Geometry } from "geojson";
import L from "leaflet";
import { useEffect, useMemo } from "react";
import "leaflet/dist/leaflet.css";
import "./map.css";
import RailLines from "./railLines.tsx";
import stationMap from "../data/stationMap.json";
import busMap from "../data/busMap.json";
import { CombinedBoardings } from "./utils/dataHandlers.tsx";

const jawgToken = import.meta.env.VITE_APP_JAWG_TOKEN;
const legendGrades = [
  500, 354, 251, 178, 126, 95, 85, 75, 65, 55, 45, 35, 25, 15, 5, 0, -5, -15,
  -25, -35, -45, -55, -65, -75, -85, -95,
];
// prettier-ignore
const legendText = [
  "1000%","","","","","100%","","","","","50%","","","","","0%","","","","","-50%","","","","","-100%",
];

// Colorblind friendly colors from -100% to 100% derived from
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
    const legend = new L.Control({ position: "topright" });
    function getColor(d: number) {
      const colorThreshold = colorThresholds.find(
        (threshold) => d >= threshold.threshold,
      );
      return colorThreshold ? colorThreshold.color : "#FFF";
    }
    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend");
      const labels = legendGrades.map(
        (grade, text) =>
          '<div style="line-height: 14px;"><i style="background:' +
          getColor(grade) +
          '; width: 13px; height: 13px; display: inline-block; vertical-align: top;"></i> ' +
          legendText[text] +
          "</div>",
      );
      div.innerHTML = labels.join("");
      return div;
    };

    legend.addTo(map);
  }, [map]);
  return null;
};

function setColor(boardingsLookup: any, mapID: string) {
  const matchingBoarding = boardingsLookup[mapID];
  if (!matchingBoarding) {
    return "#000";
  }
  const percentChange = parseFloat(matchingBoarding.percentChange);
  const colorThreshold = colorThresholds.find(
    (threshold) => percentChange >= threshold.threshold,
  );
  return colorThreshold ? colorThreshold.color : "#000";
}

function onEachBoarding(
  feature: Feature<Geometry, any>,
  layer: any,
  boardingsLookup: any,
  mapID: string,
) {
  const id = String((feature.properties as any)[mapID]);
  const color = setColor(boardingsLookup, id);
  if (!boardingsLookup[id]) {
    return;
  }
  const { name, percentChange, monthTotal2 } = boardingsLookup[id];
  const tooltip = L.tooltip({
    offset: L.point(0, -20),
    direction: "top",
    permanent: false,
    opacity: 1,
  }).setContent(
    `${name}<br/>${monthTotal2} boardings<br/>${percentChange}% change`,
  );
  layer.bindTooltip(tooltip);
  layer.setStyle({ weight: 3, color: color });
  layer.on({
    mouseover: (e: { latlng: any }) => {
      layer.setStyle({ weight: 5, color: "#7F0" });
      layer.bringToFront();
      layer.openTooltip(e.latlng);
    },
    mouseout: () => {
      layer.setStyle({ weight: 3, color: color });
      layer.closeTooltip();
    },
  });
}

const Map = ({
  toggle,
  boardings,
}: {
  boardings: CombinedBoardings[];
  toggle: boolean;
}) => {
  // toggle determines which map to use as well as the ID name of each feature
  const map = toggle ? busMap : stationMap;
  const mapID = toggle ? "ROUTE" : "Station ID";

  // boardingsLookup is used for quick feature and color assignment
  // matchingBoardings filters the map data to only include features with boarding data
  const { boardingsLookup, matchingBoardings } = useMemo(() => {
    const boardingsLookup = Object.fromEntries(
      boardings.map((boarding) => [boarding.id, boarding]),
    );
    const matchingBoardings = {
      type: "FeatureCollection",
      features: map.features.filter((feature) =>
        boardings.some(
          (boarding) =>
            boarding.id === String((feature.properties as any)[mapID]),
        ),
      ),
    } as FeatureCollection;

    return { boardingsLookup, matchingBoardings };
  }, [boardings, toggle]);

  return (
    <MapContainer center={[41.8781, -87.63]} zoom={13}>
      <TileLayer
        attribution='&copy; <a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank"><b>Jawg</b>Maps</a> 
                    &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={`https://{s}.tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=${jawgToken}`}
      />
      {!toggle && <RailLines />}
      <GeoJSON
        key={JSON.stringify(boardingsLookup)}
        data={matchingBoardings}
        pointToLayer={(feature, latlng) => {
          const id = feature.properties[mapID];
          const matchingBoarding = boardingsLookup[id];
          let radius = 8;
          if (matchingBoarding && matchingBoarding.monthTotal2) {
            radius = Math.sqrt(parseFloat(matchingBoarding.monthTotal2)) * 0.03;
          }
          return L.circleMarker(latlng, {
            radius: radius,
            fillColor: setColor(boardingsLookup, id),
            color: "#0F0",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8,
          });
        }}
        onEachFeature={(feature, layer) =>
          onEachBoarding(feature, layer, boardingsLookup, mapID)
        }
      />
      <Legend />
    </MapContainer>
  );
};

export default Map;
