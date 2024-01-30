// RailLines.tsx

import { GeoJSON } from "react-leaflet";
import { Feature, FeatureCollection, Geometry } from "geojson";
import railMapData from "../data/railMap.json";

const railMap: FeatureCollection = railMapData as FeatureCollection;

const colorMap: { [key: string]: string } = {
  'YL': '#f9e300',
  'RD': '#c60c21',
  'GR': '#009b3a',
  'BL': '#00a1de',
  'PK': '#e27ea6',
  'OR': '#f9461c',
  'BR': '#9e572c',
  'PR': '#845abf',
  'RUSH': '#845abf'
};

const RailLines = () => {
  function onEachRailLine(feature: Feature<Geometry, any>, layer: any) {
    const color = colorMap[feature.properties.LEGEND];
    if (color) {
      layer.setStyle({
        weight: 3,
        color: color,
        opacity: 1,
        dashArray: feature.properties.LEGEND === 'RUSH' ? '5, 5' : null
      })
    }
  }

  return (
    <GeoJSON
      key="railLines"
      data={railMap}
      onEachFeature={onEachRailLine}
    />
  );
}
export default RailLines;