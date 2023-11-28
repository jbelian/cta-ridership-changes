// busDisplay.tsx

import React from "react";
import { CombinedRoutes } from "./busData.tsx";

interface RouteSelectionProps {
  selectedDate1: string;
  selectedDate2: string;
  onDateChange1: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDateChange2: (event: React.ChangeEvent<HTMLInputElement>) => void;
  filteredRoutes: CombinedRoutes[];
}

function RouteSelection(props: RouteSelectionProps) {
  const {
    selectedDate1,
    selectedDate2,
    onDateChange1,
    onDateChange2,
    filteredRoutes,
  } = props;

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
      <label>
        Select years and months to compare
        {[selectedDate1, selectedDate2].map((selectedDate, index) => (
          <div key={index}>
            <input
              name="date"
              type="month"
              value={selectedDate}
              onChange={(event) =>
                index === 0 ? onDateChange1(event) : onDateChange2(event)
              }
            />
          </div>
        ))}
      </label>
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
          {filteredRoutes.map((item: CombinedRoutes, index: number) => (
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
}

export default RouteSelection;
