import { CombinedBoardings } from "./utils/dataHandlers.tsx";

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
    <div className="pb-5 pl-5 pr-5">
      <table className="w-full table-fixed">
        <thead>
          <tr className="sticky top-[70px] z-10 bg-background">
            {toggle && (
              <th className="w-[55px] pb-2 text-left font-semibold">Route</th>
            )}
            <th className="w-auto truncate pb-2 text-left font-semibold">
              {toggle ? "Bus" : '"L" Station'}
            </th>
            <th className="w-[77px] pb-2 text-right font-semibold">
              {getYearAndMonthName(selectedDate1)}
            </th>
            <th className="w-[83px] pb-2 text-right font-semibold">
              {getYearAndMonthName(selectedDate2)}
            </th>
            <th className="w-[67px] pb-2 text-right font-semibold">Change</th>
          </tr>
        </thead>
        <tbody>
          {boardings.map((item: CombinedBoardings, index: number) => (
            <tr key={index}>
              {toggle && <td className="w-[55px] text-left">{item.id}</td>}
              <td className="w-auto text-left">
                <div
                  className="max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap"
                  title={item.name}
                >
                  {item.name}
                </div>
              </td>
              <td className="text-right">{item.monthTotal}</td>
              <td className="text-right">{item.monthTotal2}</td>
              <td className="text-right">{item.percentChange}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BoardingsDisplay;
