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

  const filteredData1 = busDataArray.filter((item) => {
    const itemMonth = item.month_beginning.substring(0, 7);
    return itemMonth === selectedDate1;
  });

  const filteredData2 = busDataArray.filter((item) => {
    const itemMonth = item.month_beginning.substring(0, 7);
    return itemMonth === selectedDate2;
  });

  const combinedFilteredData: RouteData[] = [];

  filteredData1.forEach((item1) => {
    const matchingItem2 = filteredData2.find(
      (item2) => item2.route === item1.route
    );
    if (matchingItem2) {
      combinedFilteredData.push({
        route: item1.route,
        routename: item1.routename,
        month_beginning: item1.month_beginning,
        monthtotal1: item1.monthtotal,
        monthtotal2: matchingItem2.monthtotal,
      });
    } else {
      combinedFilteredData.push({
        route: item1.route,
        routename: item1.routename,
        month_beginning: item1.month_beginning,
        monthtotal1: item1.monthtotal,
        monthtotal2: "",
      });
    }
  });

  // Add any items from filteredData2 that do not have a match in filteredData1
  filteredData2.forEach((item2) => {
    const matchingItem1 = filteredData1.find(
      (item1) => item1.route === item2.route
    );
    if (!matchingItem1) {
      combinedFilteredData.push({
        route: item2.route,
        routename: item2.routename,
        month_beginning: item2.month_beginning,
        monthtotal1: "",
        monthtotal2: item2.monthtotal,
      });
    }
  });

  const handleDate1Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate1(event.target.value);
  };

  const handleDate2Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate2(event.target.value);
  };

  return (
    <div>
      <h1>Bus Data Display</h1>
      <label>Select years and months to compare</label>
      <div>
        <input
          type="month"
          value={selectedDate1}
          onChange={handleDate1Change}
        />
      </div>
      <div>
        <input
          type="month"
          value={selectedDate2}
          onChange={handleDate2Change}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Route</th>
            <th>Route Name</th>
            {/* <th>Month Beginning</th> */}
            <th>Month Total 1</th>
            <th>Month Total 2</th>
          </tr>
        </thead>
        <tbody>
          {combinedFilteredData.map((item: RouteData, index: number) => (
            <tr key={index}>
              <td>{item.route}</td>
              <td>{item.routename}</td>
              {/* <td>{item.month_beginning}</td> */}
              <td>{item.monthtotal1}</td>
              <td>{item.monthtotal2}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BusDataDisplay;
