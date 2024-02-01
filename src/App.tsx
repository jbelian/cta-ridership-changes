import React, { useEffect, useState } from "react";
import BoardingsDisplay from "./boardingsDisplay.tsx";
import Map from "./map.tsx";
import busData from "../data/busData.json";
import stationData from "../data/stationData.json";
import lastModified from "../data/lastModified.json";
import { assignStation, assignBus, Boardings, CombinedBoardings } from '../utils/dataHandlers.tsx';
import { parseBoardings } from "./boardings.tsx";

const START_DATE = "2001-01";
const GIST_URL = 'https://api.github.com/gists/cfe1d1c07128822245c55596e7e60971';

const App = () => {
  // Fetch last date of fetch from gist
  const [lastFetchedChicago, setLastFetchedChicago] = useState("");
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

  // Toggle between train station and bus data, initialized to train
  const [toggle, setToggle] = useState(false);

  // Assign bus or train as boarding data, then filter by date and return combined data
  const assignBoarding = (selectedDate1: string, selectedDate2: string, toggle: boolean): CombinedBoardings[] => {
    const boardings: Boardings[] = toggle ? assignBus(busData) : assignStation(stationData);
    const combinedBoardings: CombinedBoardings[] = parseBoardings(selectedDate1, selectedDate2, boardings);
    return combinedBoardings;
  };

  // Start and end dates for date selector
  const lastMonth = lastModified.lastMonth
  const [selectedDate1, setSelectedDate1] = useState("2001-01");
  const [selectedDate2, setSelectedDate2] = useState(lastMonth);

  // Update combinedBoardings when date or transit toggle changes
  const [combinedBoardings, setCombinedBoardings] =
    useState<CombinedBoardings[]>(assignBoarding(selectedDate1, selectedDate2, toggle));

  // Use states for boarding data
  useEffect(() => {
    const newBoardings = assignBoarding(selectedDate1, selectedDate2, toggle);
    setCombinedBoardings(newBoardings);
  }, [selectedDate1, selectedDate2, toggle]);

  // Handler for date selector
  const dateChangeHandler = (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      if (newValue < START_DATE || newValue > lastMonth) {
        setSelectedDate1(START_DATE);
        setSelectedDate2(lastMonth);
      } else {
        setter(newValue);
      }
    };

  const toggleHandler = () => {
    const newToggle = !toggle;
    setToggle(newToggle);

    // Trigger a re-fetch of the boarding data
    const newBoardings = assignBoarding(selectedDate1, selectedDate2, newToggle);
    setCombinedBoardings(newBoardings);
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
                  onChange={dateChangeHandler(index === 0 ? setSelectedDate1 : setSelectedDate2)}
                />
              </div>
            ))}
          </label>
          <button onClick={toggleHandler}>
            {toggle ? 'Show Train Stations' : 'Show Bus Routes'}
          </button>
        </div>
        <BoardingsDisplay
          selectedDate1={selectedDate1}
          selectedDate2={selectedDate2}
          boardings={combinedBoardings}
          toggle={toggle}
        />
      </aside>
      <main>
        {combinedBoardings.length > 0 &&
          <Map
            boardings={combinedBoardings.filter(boarding => boarding.percentChange !== "")}
            toggle={toggle}
          />
        }
      </main>
    </div>
  );
};

export default App;