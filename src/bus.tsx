import React from "react";
import jsonData from "./bus.json";

interface RouteData {
  route: string;
  routename: string;
  month_beginning: string;
  avg_weekday_rides: number;
  avg_saturday_rides: number;
  avg_sunday_holiday_rides: number;
  monthtotal: number;
}

const BusDataDisplay: React.FC = () => {
  const busData: RouteData[] = jsonData as RouteData[];

  return (
    <div>
      <h1>Bus Data Display</h1>
      <table>
        <thead>
          <tr>
            <th>Route</th>
            <th>Route Name</th>
            <th>Month Beginning</th>
            <th>Avg Weekday Rides</th>
            <th>Avg Saturday Rides</th>
            <th>Avg Sunday/Holiday Rides</th>
            <th>Month Total</th>
          </tr>
        </thead>
        <tbody>
          {busData.map((item: RouteData, index: number) => (
            <tr key={index}>
              <td>{item.route}</td>
              <td>{item.routename}</td>
              <td>{item.month_beginning}</td>
              <td>{item.avg_weekday_rides}</td>
              <td>{item.avg_saturday_rides}</td>
              <td>{item.avg_sunday_holiday_rides}</td>
              <td>{item.monthtotal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BusDataDisplay;
