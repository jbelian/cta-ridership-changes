// Generalized interface for bus routes or L stations
export interface Boardings {
  id: string;
  name: string;
  monthBeginning: Date;
  monthTotal: string;
}

// Additional properties added for comparison between two dates
export interface CombinedBoardings extends Boardings {
  [key: string]: any;
  monthTotal2: string;
  percentChange: string;
}

// Map the incoming station data to boardings
export const assignStation = (data: any): Boardings[] => {
  const boardings = data.map((item: any) => {
    return {
      id: item.station_id,
      name: item.stationame,
      monthBeginning: item.month_beginning,
      monthTotal: item.monthtotal,
    };
  });
  return boardings;
};

// Map the incoming bus JSON data to boardings
export const assignBus = (data: any): Boardings[] => {
  const boardings = data.map((item: any) => {
    return {
      id: item.route,
      name: item.routename,
      monthBeginning: item.month_beginning,
      monthTotal: item.monthtotal,
    };
  });
  return boardings;
};
