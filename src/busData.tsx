import busData from "./bus.json";

export interface RouteData {
  // Keeping variable names as they are in the incoming JSON file
  route: string;
  routename: string;
  month_beginning: string;
  monthtotal: string;
}

export interface ExtendedRouteData extends RouteData {
  monthtotal2: string;
  percentChange: string;
}

export const useBusData = (
  selectedDate1: string,
  selectedDate2: string
): ExtendedRouteData[] => {
  const busDataArray: RouteData[] = busData as RouteData[];

  const returnSelectedDate = (date: string) => {
    return busDataArray.filter((item) => {
      return date === item.month_beginning.substring(0, 7);
    });
  };

  const filteredData1 = returnSelectedDate(selectedDate1);
  const filteredData2 = returnSelectedDate(selectedDate2);
  const filteredData: ExtendedRouteData[] = [];

  filteredData1.forEach((item1) => {
    const matchingItem2 = filteredData2.find(
      (item2) => item2.route === item1.route
    );

    const i = item1.monthtotal;
    const j = matchingItem2 ? matchingItem2.monthtotal : "";
    const x = parseFloat(i);
    const y = parseFloat(j);

    filteredData.push({
      route: item1.route,
      routename: item1.routename,
      month_beginning: item1.month_beginning,
      monthtotal: i,
      monthtotal2: j,
      percentChange: matchingItem2
        ? (((y - x) / Math.abs(x)) * 100).toFixed(1)
        : "",
    });
  });

  filteredData2.forEach((item2) => {
    const matchingItem1 = filteredData1.find(
      (item1) => item1.route === item2.route
    );
    if (!matchingItem1) {
      filteredData.push({
        route: item2.route,
        routename: item2.routename,
        month_beginning: item2.month_beginning,
        monthtotal: "",
        monthtotal2: item2.monthtotal,
        percentChange: "",
      });
    }
  });

  return filteredData;
};
