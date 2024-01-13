// App.tsx

import React, { useEffect, useState } from "react";
import RouteSelection from "./routeList.tsx";
import Map from "./map.tsx";
import { parseBusData } from "./busData.tsx";

const App = () => {
  // Displaying the datetime of the last time the data was fetched
  // The most recent month of data is used as the end date for the date selector
  const [lastFetched, setLastFetched] = useState('');
  const [lastMonth, setLastMonth] = useState('');
  const [selectedDate1, setSelectedDate1] = useState("2001-01");
  const [selectedDate2, setSelectedDate2] = useState("2023-06");
  const [key, setKey] = useState(`${selectedDate1}-${selectedDate2}`);

  const filteredRoutes = parseBusData(selectedDate1, selectedDate2);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/' +
      'jbelian/cta-ridership-changes/main/data/last_modified.txt')
      .then(response => response.text())
      .then(data => {
        const lines = data.split('\n').map(line => line.replace('\r', ''));
        const lastFetchedGMT = new Date(lines[2].slice(-29));
        const lastFetchedChicago = lastFetchedGMT.toLocaleString('en-US', {
          timeZone: 'America/Chicago',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        });
        setLastFetched(lastFetchedChicago);
        setLastMonth(lines[1].slice(-7));
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
  }, []);

  const dateChangeHandler = (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setter(event.target.value);
      setKey(`${selectedDate1}-${selectedDate2}`);
    };

  return (
    <div className="container">
      <aside className="sidebar">
        <pre>Data last fetched: {lastFetched} (Chicago) ✨</pre>
        <label>
          Select years and months to compare:
          {[selectedDate1, selectedDate2].map((selectedDate, index) => (
            <div key={index}>
              <input
                name="date"
                type="month"
                min="2001-01"
                max={lastMonth}
                value={selectedDate}
                onChange={index === 0 ?
                  dateChangeHandler(setSelectedDate1) :
                  dateChangeHandler(setSelectedDate2)}
              />
            </div>
          ))}
        </label>
        <RouteSelection
          selectedDate1={selectedDate1}
          selectedDate2={selectedDate2}
          filteredRoutes={filteredRoutes}
        />
      </aside>
      <main>
        <Map keyProp={key} filteredRoutes={filteredRoutes} />
      </main>
    </div>
  );
};

export default App;
