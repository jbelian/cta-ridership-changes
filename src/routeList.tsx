// boardingsList.tsx

import { CombinedBoardings } from "../utils/dataHandlers.tsx";

interface BoardingsSelectionProps {
  selectedDate1: string;
  selectedDate2: string;
  filteredBoardings: CombinedBoardings[];
  toggleTransitData: boolean;
}

const getYearAndMonthName = (dateString: string) => {
  const date = new Date(`${dateString}T00:00:00`);
  const year = date.getFullYear();
  const monthName = new Intl.DateTimeFormat("en-US", {
    month: "short",
  }).format(date);
  return `${monthName} ${year}`;
};

function BoardingsSelection(props: BoardingsSelectionProps) {
  const {
    selectedDate1,
    selectedDate2,
    filteredBoardings,
    toggleTransitData
  } = props;
  return (
    <div>
      <table>
        <thead>
          <tr>
            {toggleTransitData && <th className="route-column">Route</th>}
            <th className="name-column">{toggleTransitData ? 'Bus' : 'Train Station'}</th>
            <th className="number-column">{getYearAndMonthName(selectedDate1)}</th>
            <th className="number-column">{getYearAndMonthName(selectedDate2)}</th>
            <th className="change-column">Change</th>
          </tr>
        </thead>
        <tbody>
          {filteredBoardings.map((item: CombinedBoardings, index: number) => (
            <tr key={index}>
              {toggleTransitData && <td className="route-column">{item.id}</td>}
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

export default BoardingsSelection;
