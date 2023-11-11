import "./App.css";
import React, { useState } from "react";
import RouteSelection from "./busDisplay.tsx";
import Map from "./map.tsx";
import { CombinedRoutes } from "./busData.tsx";

const App: React.FC<{}> = () => {
  return (
    <>
      <div className="container">
        <aside className="sidebar">
          <RouteSelection />
        </aside>
        <main className="map">
          {/* <Map filteredRoutes={filteredRoutes} /> */}
        </main>
      </div>
    </>
  );
};

export default App;
