// busData.tsx

import busData from "./data/bus.json";

export interface Routes {
  // Keeping variable names as they are in the incoming JSON file
  route: string;
  routename: string;
  month_beginning: string;
  monthtotal: string;
}

export interface CombinedRoutes extends Routes {
  monthtotal2: string;
  percentChange: string;
}

export const parseBusData = (
  selectedDate1: string,
  selectedDate2: string
): CombinedRoutes[] => {
  const busDataArray: Routes[] = busData as Routes[];

  const returnSelectedDate = (date: string) =>
    busDataArray.filter(
      (item) => date === item.month_beginning.substring(0, 7)
    );

  const calculatePercentChange = (x: number, y: number): string =>
    (((y - x) / Math.abs(x)) * 100).toFixed(1);

  const mergeRoutes = (
    item1: Routes,
    item2: Routes | undefined
  ): CombinedRoutes => {
    const i = parseFloat(item1.monthtotal);
    const j = item2 ? parseFloat(item2.monthtotal) : NaN;

    return {
      route: item1.route,
      routename: item1.routename,
      month_beginning: item1.month_beginning,
      monthtotal: item1.monthtotal,
      monthtotal2: item2 ? item2.monthtotal : "",
      percentChange: item2 ? calculatePercentChange(i, j) : "",
    };
  };

  const filteredRoutes1 = returnSelectedDate(selectedDate1);
  const filteredRoutes2 = returnSelectedDate(selectedDate2);

  const filteredRoutes: CombinedRoutes[] = [];

  filteredRoutes1.forEach((item1) => {
    const matchingItem2 = filteredRoutes2.find(
      (item2) => item2.route === item1.route
    );
    filteredRoutes.push(mergeRoutes(item1, matchingItem2));
  });

  filteredRoutes2.forEach((item2) => {
    const matchingItem1 = filteredRoutes1.find(
      (item1) => item1.route === item2.route
    );
    if (!matchingItem1) {
      filteredRoutes.push(mergeRoutes(item2, undefined));
    }
  });

  return filteredRoutes;
};
