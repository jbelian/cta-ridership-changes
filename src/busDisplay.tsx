import React, { useState } from "react";
import { useBusData } from "./busData.tsx";
import { ExtendedRouteData } from "./busData.tsx";

const RouteSelection: React.FC = () => {
  const [selectedDate1, setSelectedDate1] = useState("2001-01");
  const [selectedDate2, setSelectedDate2] = useState("2002-01");
  const filteredData = useBusData(selectedDate1, selectedDate2);

  const handleDateChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setter(event.target.value);
  };

  const getYearAndMonthName = (dateString: string) => {
    const date = new Date(`${dateString}T00:00:00`);
    const year = date.getFullYear();
    const monthName = new Intl.DateTimeFormat("en-US", {
      month: "short",
    }).format(date);
    return `${monthName} ${year}`;
  };

  return (
    <div>
      <label>Select years and months to compare YEAH</label>
      {[selectedDate1, selectedDate2].map((selectedDate, index) => (
        <div key={index}>
          <input
            type="month"
            value={selectedDate}
            onChange={(event) =>
              handleDateChange(
                event,
                index === 0 ? setSelectedDate1 : setSelectedDate2
              )
            }
          />
        </div>
      ))}
      <table>
        <thead>
          <tr>
            <th>Route</th>
            <th>Route Name</th>
            <th>{getYearAndMonthName(selectedDate1)}</th>
            <th>{getYearAndMonthName(selectedDate2)}</th>
            <th>Change</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item: ExtendedRouteData, index: number) => (
            <tr key={index}>
              <td>{item.route}</td>
              <td>{item.routename}</td>
              <td>{item.monthtotal}</td>
              <td>{item.monthtotal2}</td>
              <td>{item.percentChange}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RouteSelection;
