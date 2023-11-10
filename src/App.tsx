import "./App.css";
import React, { useState } from "react";
import RouteSelection from "./busDisplay.tsx";
import MapComponent from "./map.tsx";
import { ExtendedRouteData } from "./busData.tsx";

const App: React.FC = () => {
  const [filteredData] = useState<ExtendedRouteData[]>([]);
  return (
    <>
      <div className="container">
        <aside className="sidebar">
          <RouteSelection />
        </aside>
        <main className="map">
          <MapComponent filteredData={filteredData} />
        </main>
      </div>
    </>
  );
};

export default App;
