import { useEffect, useState } from "react";
import BoardingsDisplay from "./boardingsDisplay.tsx";
import Map from "./map.tsx";
import busData from "../data/busData.json";
import stationData from "../data/stationData.json";
import lastModified from "../data/lastModified.json";
import {
  assignStation,
  assignBus,
  Boardings,
  CombinedBoardings,
} from "./utils/dataHandlers.tsx";
import { parseBoardings } from "./boardings.tsx";
import { Calendar } from "./components/calendar.tsx";
import { Label } from "@/components/label";
import { Switch } from "@/components/switch";
import { Toggle } from "./components/toggle.tsx";
import { MoonIcon, SunIcon } from "lucide-react";
import "react-day-picker/dist/style.css";

const START_DATE = new Date(2001, 0);
const [year, month] = lastModified.lastMonth.split("-");
const END_DATE = new Date(parseInt(year), parseInt(month) - 1);
const GIST_URL =
  "https://api.github.com/gists/cfe1d1c07128822245c55596e7e60971";

const App = () => {
  // Fetch last date of fetch from gist
  const [lastFetched, setLastFetched] = useState<Date>();
  useEffect(() => {
    const fetchGist = async () => {
      const response = await fetch(GIST_URL);
      const data = await response.json();
      const date = data.files["lastFetched.json"].content;
      setLastFetched(new Date(date));
    };
    fetchGist();
  }, []);

  // Toggle between train station and bus data, initialized to train
  const [toggle, setToggle] = useState(false);

  // Toggle dark mode, initialized to dark
  const [darkMode, setDarkMode] = useState(true);
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Assign bus or train as boarding data, then filter by date and return combined data
  const assignBoarding = (
    selectedDate1: Date,
    selectedDate2: Date,
    toggle: boolean,
  ): CombinedBoardings[] => {
    const boardings: Boardings[] = toggle
      ? assignBus(busData)
      : assignStation(stationData);
    const combinedBoardings: CombinedBoardings[] = parseBoardings(
      selectedDate1,
      selectedDate2,
      boardings,
    );
    return combinedBoardings;
  };

  // Start and end dates for date selector
  const [selectedDate1, setSelectedDate1] = useState(START_DATE);
  const [selectedDate2, setSelectedDate2] = useState(END_DATE);
  useEffect(() => {
    if (selectedDate1 > END_DATE) {
      setSelectedDate1(END_DATE);
    }
    if (selectedDate2 > END_DATE) {
      setSelectedDate2(END_DATE);
    }
  }, [selectedDate1, selectedDate2]);

  // Update combinedBoardings when date or transit toggle changes
  const [combinedBoardings, setCombinedBoardings] = useState<
    CombinedBoardings[]
  >(assignBoarding(selectedDate1, selectedDate2, toggle));

  // Use states for boarding data
  useEffect(() => {
    const newBoardings = assignBoarding(selectedDate1, selectedDate2, toggle);
    setCombinedBoardings(newBoardings);
  }, [selectedDate1, selectedDate2, toggle]);

  const toggleHandler = () => {
    const newToggle = !toggle;
    setToggle(newToggle);

    // Trigger a re-fetch of the boarding data
    const newBoardings = assignBoarding(
      selectedDate1,
      selectedDate2,
      newToggle,
    );
    setCombinedBoardings(newBoardings);
  };

  return (
    // consider div-relative, aside-absolute for "floating" effect of sidebar
    <div className="flex h-screen w-screen bg-background leading-relaxed">
      <aside
        className="z-20 h-screen w-[525px] flex-shrink-0 overflow-y-auto bg-background"
        style={{
          boxShadow: "0 0 10px rgba(0, 0, 0, 1)",
        }}
      >
        <h1 className="pb-8 pl-5 pr-5 pt-8 text-left text-6xl font-bold">
          CTA Ridership Changes
        </h1>
        <div className="flex items-center justify-between pb-10 pl-5 pr-5">
          <div className="text-opacity-50">
            <span>Updated </span>
            <time dateTime={lastFetched?.toLocaleString()}>
              {new Date(lastModified.lastModified)
                .toLocaleString()
                .replace("AM", "a.m.")
                .replace("PM", "p.m.")}
            </time>
            <br />
            {lastFetched ? (
              <span>
                {`Checked for updates `}
                <time>
                  {(() => {
                    const now = new Date();
                    const diffInMilliseconds =
                      now.getTime() - lastFetched.getTime();
                    const diffInMinutes = Math.floor(
                      diffInMilliseconds / (1000 * 60),
                    );
                    if (diffInMinutes <= 1) {
                      return `a moment ago`;
                    }
                    if (diffInMinutes < 60) {
                      return `${diffInMinutes} minutes ago`;
                    }
                    if (diffInMinutes < 120) {
                      return `an hour ago`;
                    }
                    if (diffInMinutes < 1440) {
                      const diffInHours = Math.floor(diffInMinutes / 60);
                      return `${diffInHours} hours ago`;
                    }
                    const diffInDays = Math.floor(diffInMinutes / (60 * 24));
                    return diffInDays >= 1 && diffInDays < 2
                      ? `a day ago`
                      : `${diffInDays} days ago`;
                  })()}
                </time>
              </span>
            ) : (
              <br />
            )}
          </div>
          <div>
            <Toggle
              onClick={() => {
                setDarkMode(!darkMode);
              }}
              className="hover:!text-muted-foreground data-[state=off]:bg-transparent data-[state=on]:bg-transparent"
              aria-label="Toggle between light and dark mode"
            >
              {darkMode ? (
                <MoonIcon className="h-4 w-4" />
              ) : (
                <SunIcon className="h-4 w-4" />
              )}
            </Toggle>
          </div>
        </div>
        <div className="sticky top-0 z-10 flex h-[70px] justify-between bg-background">
          <div className="flex pl-5">
            <div className="flex w-[170px] items-center space-x-2">
              <Label htmlFor="transitToggle" className="text-right">
                The "L"
              </Label>
              <Switch
                onClick={toggleHandler}
                className="data-[state=checked]:primary-foreground data-[state=unchecked]:primary-foreground border-[1px] border-muted-foreground/30"
                aria-label="Toggle between train (the L) data and bus data"
              />
              <Label htmlFor="transitToggle">The Bus</Label>
            </div>
          </div>
          <div className="flex items-center justify-end">
            <Calendar
              mode="single"
              defaultMonth={START_DATE}
              fromMonth={START_DATE}
              toMonth={END_DATE}
              selected={selectedDate1}
              onMonthChange={setSelectedDate1}
              disabled={{ after: END_DATE }}
              aria-label="Select a start date"
            />
            <Calendar
              mode="single"
              defaultMonth={END_DATE}
              fromMonth={START_DATE}
              toMonth={END_DATE}
              selected={selectedDate2}
              onMonthChange={setSelectedDate2}
              disabled={{ after: END_DATE }}
              aria-label="Select an end date"
            />
          </div>
        </div>
        <BoardingsDisplay
          selectedDate1={selectedDate1.toISOString().substring(0, 7)}
          selectedDate2={selectedDate2.toISOString().substring(0, 7)}
          boardings={combinedBoardings}
          toggle={toggle}
          aria-label="List of boarding data"
        />
      </aside>
      <main className="z-0 h-screen w-screen bg-red-500">
        {combinedBoardings.length > 0 && (
          <Map
            boardings={combinedBoardings.filter(
              (boarding) => boarding.percentChange !== "",
            )}
            toggle={toggle}
            darkMode={darkMode}
            aria-label="Map of boarding data"
          />
        )}
      </main>
    </div>
  );
};

export default App;
