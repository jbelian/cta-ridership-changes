//routes.tsx

import stationData from "../data/station.json";

// Map the incoming train JSON data to stations
const assignStationData = (trainData: any): Routes[] => {
  const stations = trainData.map((item: any) => {
    return {
      id: item.station_id,
      name: item.stationame,
      monthBeginning: item.month_beginning,
      monthTotal: item.monthtotal,
    };
  });
  return stations;
}

// Generalized interface for bus routes or L stations
export interface Routes {
  id: string;
  name: string;
  monthBeginning: string;
  monthTotal: string;
}

// Additional properties added for comparison between two dates
export interface CombinedRoutes extends Routes {
  monthTotal2: string;
  percentChange: string;
}

function compareRoutes(a: CombinedRoutes, b: CombinedRoutes): number {
  const removeNonNumeric = (route: string): string => route.replace(/\D/g, "");

  const numericPartA = removeNonNumeric(a.id);
  const numericPartB = removeNonNumeric(b.id);

  return numericPartA.localeCompare(numericPartB, undefined, {
    numeric: true,
  });
}

export const parseRouteData = (
  selectedDate1: string,
  selectedDate2: string
): CombinedRoutes[] => {
  const routeDataArray: Routes[] = assignStationData(stationData);

  const returnSelectedDate = (date: string) => {
    return routeDataArray.filter((item) => {
      return date === item.monthBeginning.substring(0, 7);
    });
  };

  const filteredRoutes1 = returnSelectedDate(selectedDate1);
  const filteredRoutes2 = returnSelectedDate(selectedDate2);

  // Temporarily stores non-matching routes
  const onlyFilteredRoutes1: CombinedRoutes[] = [];
  const onlyFilteredRoutes2: CombinedRoutes[] = [];

  // Stores all routes and is returned when parseRouteData runs
  let combinedFilteredRoutes: CombinedRoutes[] = [];

  // Collects routes found in both selected dates and those found only in the first
  filteredRoutes1.forEach((item1) => {
    const matchingItem2 = filteredRoutes2.find(
      (item2) => item2.id === item1.id
    );

    const i: string = item1.monthTotal;
    const j: string = matchingItem2 ? matchingItem2.monthTotal : "";
    const x: number = parseFloat(i);
    const y: number = parseFloat(j);

    const newItem: CombinedRoutes = {
      ...item1,
      monthTotal2: j,
      percentChange: matchingItem2
        ? (((y - x) / Math.abs(x)) * 100).toFixed(1)
        : "",
    };

    if (matchingItem2) {
      combinedFilteredRoutes.push(newItem);
    } else {
      onlyFilteredRoutes1.push(newItem);
    }
  });

  // Collects routes found only in the second selected date
  filteredRoutes2.forEach((item2) => {
    const matchingItem1 = filteredRoutes1.find(
      (item1) => item1.id === item2.id
    );
    if (!matchingItem1) {
      onlyFilteredRoutes2.push({
        id: item2.id,
        name: item2.name,
        monthBeginning: item2.monthBeginning,
        monthTotal: "",
        monthTotal2: item2.monthTotal,
        percentChange: "",
      });
    }
  });

  // Sorts each array of routes independently and then combines them
  combinedFilteredRoutes = [
    ...combinedFilteredRoutes.sort(compareRoutes),
    ...onlyFilteredRoutes1.sort(compareRoutes),
    ...onlyFilteredRoutes2.sort(compareRoutes),
  ];

  return combinedFilteredRoutes;
};
