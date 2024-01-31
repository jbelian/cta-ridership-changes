import { CombinedBoardings } from "../utils/dataHandlers.tsx";

const getYearAndMonthName = (dateString: string) => {
  const date = new Date(`${dateString}T00:00:00`);
  const year = date.getFullYear();
  const monthName = new Intl.DateTimeFormat("en-US", {
    month: "short",
  }).format(date);
  return `${monthName} ${year}`;
};

function BoardingsDisplay({
  selectedDate1,
  selectedDate2,
  boardings,
  toggle
}: {
  selectedDate1: string;
  selectedDate2: string;
  boardings: CombinedBoardings[];
  toggle: boolean;
}) {
  return (
    <div>
      <table>
        <thead>
          <tr>
            {toggle && <th className="route-column">Route</th>}
            <th className="name-column">{toggle ? 'Bus' : 'Train Station'}</th>
            <th className="number-column">{getYearAndMonthName(selectedDate1)}</th>
            <th className="number-column">{getYearAndMonthName(selectedDate2)}</th>
            <th className="change-column">Change</th>
          </tr>
        </thead>
        <tbody>
          {boardings.map((item: CombinedBoardings, index: number) => (
            <tr key={index}>
              {toggle && <td className="route-column">{item.id}</td>}
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

export default BoardingsDisplay;