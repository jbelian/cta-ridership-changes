//boardings.tsx

import { Boardings, CombinedBoardings } from '../utils/dataHandlers.tsx';

// Sorts by boarding number in numeric order, ignoring letters, for example:
// 31   31st
// 55A	55th/Austin
// 95   95th
// X98	Avon Express
// 111A	Pullman Shuttle
function compareBoardings(a: CombinedBoardings, b: CombinedBoardings): number {
  const removeNonNumeric = (boarding: string): string => boarding.replace(/\D/g, "");

  const numericPartA = removeNonNumeric(a.id);
  const numericPartB = removeNonNumeric(b.id);

  return numericPartA.localeCompare(numericPartB, undefined, {
    numeric: true,
  });
}

export const parseBoardingData = (
  selectedDate1: string,
  selectedDate2: string,
  boardingData: Boardings[]
) => {

  const returnSelectedDate = (date: string) => {
    return boardingData.filter((item) => {
      return date === item.monthBeginning.substring(0, 7);
    });
  };

  const filteredBoardings1 = returnSelectedDate(selectedDate1);
  const filteredBoardings2 = returnSelectedDate(selectedDate2);

  // Temporarily stores non-matching boardings
  const onlyFilteredBoardings1: CombinedBoardings[] = [];
  const onlyFilteredBoardings2: CombinedBoardings[] = [];

  // Stores all boardings and is returned when parseBoardingData runs
  let combinedFilteredBoardings: CombinedBoardings[] = [];

  // Collects boardings found in both selected dates and those found only in the first
  filteredBoardings1.forEach((item1) => {
    const matchingItem2 = filteredBoardings2.find(
      (item2) => item2.id === item1.id
    );

    const i: string = item1.monthTotal;
    const j: string = matchingItem2 ? matchingItem2.monthTotal : "";
    const x: number = parseFloat(i);
    const y: number = parseFloat(j);

    const newItem: CombinedBoardings = {
      ...item1,
      monthTotal2: j,
      percentChange: matchingItem2
        ? (((y - x) / Math.abs(x)) * 100).toFixed(1)
        : "",
    };

    if (matchingItem2) {
      combinedFilteredBoardings.push(newItem);
    } else {
      onlyFilteredBoardings1.push(newItem);
    }
  });

  // Collects boardings found only in the second selected date
  filteredBoardings2.forEach((item2) => {
    const matchingItem1 = filteredBoardings1.find(
      (item1) => item1.id === item2.id
    );
    if (!matchingItem1) {
      onlyFilteredBoardings2.push({
        id: item2.id,
        name: item2.name,
        monthBeginning: item2.monthBeginning,
        monthTotal: "",
        monthTotal2: item2.monthTotal,
        percentChange: "",
      });
    }
  });

  // Sorts each array of boardings independently and then combines them
  combinedFilteredBoardings = [
    ...combinedFilteredBoardings.sort(compareBoardings),
    ...onlyFilteredBoardings1.sort(compareBoardings),
    ...onlyFilteredBoardings2.sort(compareBoardings),
  ];

  return combinedFilteredBoardings;
};