// routeList.tsx

import { CombinedRoutes } from "./busData.tsx";

interface RouteSelectionProps {
  selectedDate1: string;
  selectedDate2: string;
  filteredRoutes: CombinedRoutes[];
}

const getYearAndMonthName = (dateString: string) => {
  const date = new Date(`${dateString}T00:00:00`);
  const year = date.getFullYear();
  const monthName = new Intl.DateTimeFormat("en-US", {
    month: "short",
  }).format(date);
  return `${monthName} ${year}`;
};

function RouteSelection(props: RouteSelectionProps) {
  const {
    selectedDate1,
    selectedDate2,
    filteredRoutes
  } = props;
  return (
    <div>
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
