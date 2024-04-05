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
  toggle,
}: {
  selectedDate1: string;
  selectedDate2: string;
  boardings: CombinedBoardings[];
  toggle: boolean;
}) {
  return (
    <div>
      <table className="table-fixed w-full">
        <thead>
          <tr>
            {toggle && <th className="w-[55px] text-left">Route</th>}
            <th className="w-auto text-left truncate">
              {toggle ? "Bus" : "Train Station"}
            </th>
            <th className="w-[77px] text-right">
              {getYearAndMonthName(selectedDate1)}
            </th>
            <th className="w-[77px] text-right">
              {getYearAndMonthName(selectedDate2)}
            </th>
            <th className="w-[67px] text-right">Change</th>
          </tr>
        </thead>
        <tbody>
          {boardings.map((item: CombinedBoardings, index: number) => (
            <tr key={index}>
              {toggle && <td className="w-[55px] text-left">{item.id}</td>}
              <td className="w-auto text-left">
                <div
                  className="whitespace-nowrap overflow-hidden overflow-ellipsis max-w-full"
                  title={item.name}
                >
                  {item.name}
                </div>
              </td>
              <td className="w-[77px] text-right">{item.monthTotal}</td>
              <td className="w-[77px] text-right">{item.monthTotal2}</td>
              <td className="w-[67px] text-right">{item.percentChange}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BoardingsDisplay;
