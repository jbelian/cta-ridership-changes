//routes.tsx

import routeData from "../data/train.json";

// Map the incoming train JSON data to routes
const mapTrainDataToRoutes = (trainData: any): Routes[] => {
  const routes = trainData.map((item: any) => {
    return {
      route: item.station_id,
      routename: item.stationame,
      month_beginning: item.month_beginning,
      monthtotal: item.monthtotal,
    };
  });
  return routes;
}



// Keeping variable names as they are in the incoming JSON file
export interface Routes {
  route: string;
  routename: string;
  month_beginning: string;
  monthtotal: string;
}

// Additional properties added for comparison between two dates
export interface CombinedRoutes extends Routes {
  monthtotal2: string;
  percentChange: string;
}

export const parseRouteData = (
  selectedDate1: string,
  selectedDate2: string
): CombinedRoutes[] => {
  const routeDataArray: Routes[] = mapTrainDataToRoutes(routeData);
  console.log(routeDataArray)

  const returnSelectedDate = (date: string) => {
    return routeDataArray.filter((item) => {
      return date === item.month_beginning.substring(0, 7);
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
      combinedFilteredRoutes.push(newItem);
    } else {
      onlyFilteredRoutes1.push(newItem);
    }
  });

  // Collects routes found only in the second selected date
  filteredRoutes2.forEach((item2) => {
    const matchingItem1 = filteredRoutes1.find(
      (item1) => item1.route === item2.route
    );
    if (!matchingItem1) {
      onlyFilteredRoutes2.push({
        route: item2.route,
        routename: item2.routename,
        month_beginning: item2.month_beginning,
        monthtotal: "",
        monthtotal2: item2.monthtotal,
        percentChange: "",
      });
    }
  });

  // Sorts each array of routes independently and then combines them
  // combinedFilteredRoutes = [
  //   ...combinedFilteredRoutes.sort(compareRoutes),
  //   ...onlyFilteredRoutes1.sort(compareRoutes),
  //   ...onlyFilteredRoutes2.sort(compareRoutes),
  // ];

  return combinedFilteredRoutes;
};
