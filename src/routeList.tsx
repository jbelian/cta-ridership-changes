// routeList.tsx

import { CombinedRoutes } from "./trainStations.tsx";

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
            <th className="route-column">Route</th>
            <th className="name-column">Route Name</th>
            <th className="number-column">{getYearAndMonthName(selectedDate1)}</th>
            <th className="number-column">{getYearAndMonthName(selectedDate2)}</th>
            <th className="change-column">Change</th>
          </tr>
        </thead>
        <tbody>
          {filteredRoutes.map((item: CombinedRoutes, index: number) => (
            <tr key={index}>
              <td className="route-column">{item.id}</td>
              <td className="name-column">{item.name}</td>
              <td className="number-column">{item.monthTotal}</td>
              <td className="number-column">{item.monthTotal2}</td>
              <td className="change-column">{item.percentChange}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RouteSelection;
