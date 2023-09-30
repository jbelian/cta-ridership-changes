import React, { useState } from "react";
import busData from "./bus.json";

interface RouteData {
  route: string;
  routename: string;
  month_beginning: string;
  monthtotal: string;
}

const BusDataDisplay: React.FC = () => {
  const busDataArray: RouteData[] = busData as RouteData[];

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

  interface extendedRouteData extends RouteData {
    monthtotal2: String;
  }
  const combinedFilteredData: extendedRouteData[] = [];

  filteredData1.forEach((item1) => {
    const matchingItem2 = filteredData2.find(
      (item2) => item2.route === item1.route
    );
    combinedFilteredData.push({
      route: item1.route,
      routename: item1.routename,
      month_beginning: item1.month_beginning,
      monthtotal: item1.monthtotal,
      monthtotal2: matchingItem2 ? matchingItem2.monthtotal : "",
    });
  });

  filteredData2.forEach((item2) => {
    if (!filteredData1.find((item1) => item1.route === item2.route)) {
      combinedFilteredData.push({
        route: item2.route,
        routename: item2.routename,
        month_beginning: item2.month_beginning,
        monthtotal: "",
        monthtotal2: item2.monthtotal,
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
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BusDataDisplay;
