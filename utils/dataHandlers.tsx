// Generalized interface for bus routes or L stations
export interface Boardings {
  id: string;
  name: string;
  monthBeginning: string;
  monthTotal: string;
}

// Additional properties added for comparison between two dates
export interface CombinedBoardings extends Boardings {
  monthTotal2: string;
  percentChange: string;
}

// Map the incoming station data to boardings
export const assignTrainStationData = (data: any): Boardings[] => {
  const stations = data.map((item: any) => {
    return {
      id: item.station_id,
      name: item.stationame,
      monthBeginning: item.month_beginning,
      monthTotal: item.monthtotal,
    };
  });
  return stations;
}

// Map the incoming bus JSON data to boardings
export const assignBusRouteData = (data: any): Boardings[] => {
  const routes = data.map((item: any) => {
    return {
      id: item.route,
      name: item.routename,
      monthBeginning: item.month_beginning,
      monthTotal: item.monthtotal,
    };
  });
  return routes;
}