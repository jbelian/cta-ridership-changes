// App.tsx

import React, { useState } from "react";
import RouteSelection from "./busDisplay.tsx";
import Map from "./map.tsx";
import { parseBusData } from "./busData.tsx";

const App = () => {
  const [selectedDate1, setSelectedDate1] = useState("2001-01");
  const [selectedDate2, setSelectedDate2] = useState("2002-01");
  const [key, setKey] = useState("");

  const handleDateChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setter(event.target.value);
    setKey(`${selectedDate1}-${selectedDate2}-${Date.now()}`);
  };

  const filteredRoutes = parseBusData(selectedDate1, selectedDate2);

  return (
    <>
      <div className="container">
        <aside className="sidebar">
          <RouteSelection
            selectedDate1={selectedDate1}
            selectedDate2={selectedDate2}
            onDateChange1={(event) => handleDateChange(event, setSelectedDate1)}
            onDateChange2={(event) => handleDateChange(event, setSelectedDate2)}
            filteredRoutes={filteredRoutes}
          />
        </aside>
        <main>
          <Map keyProp={key} filteredRoutes={filteredRoutes} />
        </main>
      </div>
    </>
  );
};

export default App;
