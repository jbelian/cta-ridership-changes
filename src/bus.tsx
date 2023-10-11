import React, { useState } from "react";
import busData from "./bus.json";

const BusDataDisplay: React.FC = () => {
  // Keeping variable names as they are in the incoming JSON file
  interface routeData {
    route: string;
    routename: string;
    month_beginning: string;
    avg_weekday_rides: string;
    avg_saturday_rides: string;
    avg_sunday_holiday_rides: string;
    monthtotal: string;
  }

  const busDataArray: routeData[] = busData as routeData[];

  const [selectedDate1, setSelectedDate1] = useState<string>("2001-01");
  const [selectedDate2, setSelectedDate2] = useState<string>("2002-01");

  const returnSelectedDate = (selectedDate: string) => {
    return busDataArray.filter((item) => {
      const itemMonth = item.month_beginning.substring(0, 7);
      return itemMonth === selectedDate;
    });
  };

  const filteredData1 = returnSelectedDate(selectedDate1);
  const filteredData2 = returnSelectedDate(selectedDate2);

  interface extendedRouteData extends routeData {
    monthtotal2: number;
    percentChange: string;
  }
  const combinedFilteredData: extendedRouteData[] = [];

  filteredData1.forEach((item1) => {
    const matchingItem2 = filteredData2.find(
      (item2) => item2.route === item1.route
    );

    const i = item1.monthtotal;
    const j = matchingItem2 ? matchingItem2.monthtotal : 0;

    combinedFilteredData.push({
      route: item1.route,
      routename: item1.routename,
      month_beginning: item1.month_beginning,
      monthtotal: i,
      monthtotal2: j,
      percentChange: matchingItem2
        ? (((j - i) / Math.abs(i)) * 100).toFixed(1)
        : "",
    });
  });

  filteredData2.forEach((item2) => {
    if (!filteredData1.find((item1) => item1.route === item2.route)) {
      combinedFilteredData.push({
        route: item2.route,
        routename: item2.routename,
        month_beginning: item2.month_beginning,
        monthtotal: 0,
        monthtotal2: item2.monthtotal,
        percentChange: "",
      });
    }
  });

  const handleDateChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setSelectedDate: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setSelectedDate(event.target.value);
  };

  return (
    <div>
      <h1>Bus Data Display</h1>
      <label>Select years and months to compare</label>
      <div>
        <input
          type="month"
          value={selectedDate1}
          onChange={(event) => handleDateChange(event, setSelectedDate1)}
        />
      </div>
      <div>
        <input
          type="month"
          value={selectedDate2}
          onChange={(event) => handleDateChange(event, setSelectedDate2)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Route</th>
            <th>Route Name</th>
            {/* <th>Month Beginning</th> */}
            <th>Monthly Ridership 1</th>
            <th>Monthly Ridership 2</th>
            <th>Change</th>
          </tr>
        </thead>
        <tbody>
          {combinedFilteredData.map(
            (item: extendedRouteData, index: number) => (
              <tr key={index}>
                <td>{item.route}</td>
                <td>{item.routename}</td>
                {/* <td>{item.month_beginning}</td> */}
                <td>{item.monthtotal}</td>
                <td>{item.monthtotal2}</td>
                <td>{item.percentChange}</td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BusDataDisplay;
