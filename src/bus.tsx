import React, { useState } from "react";
import { useBusData } from "./busDataHook.tsx";
import { ExtendedRouteData } from "./busDataHook.tsx";

console.log("BUS.TSX");

// Component to render the bus data table
const BusDataTable: React.FC<{
  combinedFilteredData: ExtendedRouteData[];
  selectedDate1: string;
  selectedDate2: string;
}> = ({ combinedFilteredData, selectedDate1, selectedDate2 }) => {
  const getYearAndMonthName = (dateString: string) => {
    const date = new Date(`${dateString}T00:00:00`);
    const year = date.getFullYear();
    const monthName = new Intl.DateTimeFormat("en-US", {
      month: "short",
    }).format(date);
    return `${monthName} ${year}`;
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Route</th>
          <th>Route Name</th>
          {/* <th>Month Beginning</th> */}
          <th>{getYearAndMonthName(selectedDate1)}</th>
          <th>{getYearAndMonthName(selectedDate2)}</th>
          <th>Change</th>
        </tr>
      </thead>
      <tbody>
        {combinedFilteredData.map((item: ExtendedRouteData, index: number) => (
          <tr key={index}>
            <td>{item.route}</td>
            <td>{item.routename}</td>
            {/* <td>{item.month_beginning}</td> */}
            <td>{item.monthtotal}</td>
            <td>{item.monthtotal2}</td>
            <td>{item.percentChange}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const BusDataDisplay: React.FC = () => {
  // Keeping variable names as they are in the incoming JSON file

  const [selectedDate1, setSelectedDate1] = useState<string>("2001-01");
  const [selectedDate2, setSelectedDate2] = useState<string>("2002-01");

  const combinedFilteredData = useBusData(selectedDate1, selectedDate2);

  const handleDateChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setSelectedDate: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setSelectedDate(event.target.value);
  };

  return (
    console.log(combinedFilteredData),
    (
      <div>
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

        <BusDataTable
          combinedFilteredData={combinedFilteredData}
          selectedDate1={selectedDate1}
          selectedDate2={selectedDate2}
        />
      </div>
    )
  );
};

export default BusDataDisplay;
