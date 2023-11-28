//busData.tsx

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

  const returnSelectedDate = (date: string) => {
    return busDataArray.filter((item) => {
      return date === item.month_beginning.substring(0, 7);
    });
  };

  const filteredRoutes1 = returnSelectedDate(selectedDate1);
  const filteredRoutes2 = returnSelectedDate(selectedDate2);
  const matchingItems: CombinedRoutes[] = [];
  const nonMatchingItems: CombinedRoutes[] = [];

  filteredRoutes1.forEach((item1) => {
    const matchingItem2 = filteredRoutes2.find(
      (item2) => item2.route === item1.route
    );

    const i: string = item1.monthtotal;
    const j: string = matchingItem2 ? matchingItem2.monthtotal : "";
    const x: number = parseFloat(i);
    const y: number = parseFloat(j);

    const newItem: CombinedRoutes = {
      ...item1,
      monthtotal2: j,
      percentChange: matchingItem2
        ? (((y - x) / Math.abs(x)) * 100).toFixed(1)
        : "",
    };

    if (matchingItem2) {
      matchingItems.push(newItem);
    } else {
      nonMatchingItems.push(newItem);
    }
  });

  const combinedFilteredRoutes: CombinedRoutes[] =
    matchingItems.concat(nonMatchingItems);

  filteredRoutes2.forEach((item2) => {
    const matchingItem1 = filteredRoutes1.find(
      (item1) => item1.route === item2.route
    );
    if (!matchingItem1) {
      combinedFilteredRoutes.push({
        route: item2.route,
        routename: item2.routename,
        month_beginning: item2.month_beginning,
        monthtotal: "",
        monthtotal2: item2.monthtotal,
        percentChange: "",
      });
    }
  });

  return combinedFilteredRoutes;
};
