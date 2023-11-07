import "./App.css";

import BusDataDisplay from "./bus.tsx";
import MapComponent from "./map.tsx";

//import { fetchData } from "./components/fetch.tsx";
//fetchData();

export default function App() {
  return (
    <>
      <div className="container">
        <aside className="sidebar">
          <BusDataDisplay />
        </aside>
        <main className="map">
          <MapComponent />
        </main>
      </div>
    </>
  );
}
