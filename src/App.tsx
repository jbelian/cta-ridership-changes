// App.tsx

import React, { useEffect, useState } from "react";
import BoardingsSelection from "./routeList.tsx";
import Map from "./map.tsx";
import busData from "../data/busData.json";
import stationData from "../data/stationData.json";
import lastModified from "../data/lastModified.json";
import { assignTrainStationData, assignBusRouteData, Boardings, CombinedBoardings } from '../utils/dataHandlers.tsx';
import { parseBoardingData } from "./boardings.tsx";

const START_DATE = "2001-01";
const GIST_URL = 'https://api.github.com/gists/cfe1d1c07128822245c55596e7e60971';

const App = () => {
  // The most recent month of data is used as the end date for the date selector
  const lastMonth = lastModified.lastMonth

  // Fetch last date of fetch from gist
  const [lastFetchedChicago, setLastFetchedChicago] = useState("");

  // Toggle between train station and bus data, initialized to train
  const [toggleTransitData, setToggleTransitData] = useState(false);

  // Simply updates the last fetch time
  useEffect(() => {
    const fetchGist = async () => {
      const response = await fetch(GIST_URL);
      const data = await response.json();
      const fileContent = data.files['lastFetched.json'].content;
      const lastFetchedGMT = new Date(fileContent);
      const formattedDate = lastFetchedGMT.toLocaleString('en-US', {
        timeZone: 'America/Chicago',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      setLastFetchedChicago(formattedDate);
    };
    fetchGist();
  }, []);

  // Assign bus or train as boarding data, then filter by date and return combined data
  const assignBoardingData = (selectedDate1: string, selectedDate2: string, toggleTransitData: boolean): CombinedBoardings[] => {
    const boardingData: Boardings[] = toggleTransitData ? assignBusRouteData(busData) : assignTrainStationData(stationData);
    const combinedFilteredBoardingData: CombinedBoardings[] = parseBoardingData(selectedDate1, selectedDate2, boardingData);
    return combinedFilteredBoardingData;
  };

  // Start and end dates for date selector
  const [selectedDate1, setSelectedDate1] = useState("2001-01");
  const [selectedDate2, setSelectedDate2] = useState(lastMonth);

  // Key prop for map component state management
  const [key, setKey] = useState(`${selectedDate1}-${selectedDate2}`);

  // Update combinedFilteredBoardingData when date or transit toggle changes
  const [combinedFilteredBoardingData, setCombinedFilteredBoardingData] = useState<CombinedBoardings[]>(assignBoardingData(selectedDate1, selectedDate2, toggleTransitData));

  // Use states for boarding data
  useEffect(() => {
    const newBoardingData = assignBoardingData(selectedDate1, selectedDate2, toggleTransitData);
    setCombinedFilteredBoardingData(newBoardingData);
  }, [selectedDate1, selectedDate2, toggleTransitData]);

  // Handler for date selector
  const dateChangeHandler = (index: number, setter: React.Dispatch<React.SetStateAction<string>>) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      if (newValue < START_DATE || newValue > lastMonth) {
        setSelectedDate1(START_DATE);
        setSelectedDate2(lastMonth);
        setKey(START_DATE + `-${lastMonth}`);
      } else {
        setter(newValue);
        setKey(index === 0 ? `${newValue}-${selectedDate2}` : `${selectedDate1}-${newValue}`);
      }
    };

  const toggleTransitDataHandler = () => {
    setToggleTransitData(prevToggleTransitData => !prevToggleTransitData);
    // Update keyProp to force re-render of Map component
    setKey(prevKey => prevKey + '-toggle');
    // Trigger a re-fetch of the boarding data
    const newBoardingData = assignBoardingData(selectedDate1, selectedDate2, !toggleTransitData);
    setCombinedFilteredBoardingData(newBoardingData);
  };

  return (
    <div className="container">
      <aside className="sidebar">
        <pre>Data last fetched: {lastFetchedChicago} (Chicago) ✨</pre>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label>
            Select years and months to compare:
            {[selectedDate1, selectedDate2].map((selectedDate, index) => (
              <div key={index}>
                <input
                  name="date"
                  type="month"
                  min={START_DATE}
                  max={lastMonth}
                  value={selectedDate}
                  onChange={dateChangeHandler(index, index === 0 ? setSelectedDate1 : setSelectedDate2)}
                />
              </div>
            ))}
          </label>
          <button onClick={toggleTransitDataHandler}>
            {toggleTransitData ? 'Show Train Stations' : 'Show Bus Routes'}
          </button>
        </div>
        <BoardingsSelection
          selectedDate1={selectedDate1}
          selectedDate2={selectedDate2}
          filteredBoardings={combinedFilteredBoardingData}
          toggleTransitData={toggleTransitData}
        />
      </aside>
      <main>
        {combinedFilteredBoardingData.length > 0 &&
          <Map keyProp={key} toggleTransitData={toggleTransitData} boardings={combinedFilteredBoardingData} />
        }
      </main>
    </div>
  );
};

export default App;