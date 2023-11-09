import React, { useState } from "react";
import { useBusData, BusDataTable } from "./busDataHook";

const BusDataDisplay: React.FC = () => {
  const [selectedDate1, setSelectedDate1] = useState<string>("2001-01");
  const [selectedDate2, setSelectedDate2] = useState<string>("2002-01");

  const combinedFilteredData = useBusData(selectedDate1, selectedDate2);

  const handleDateChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setSelectedDate: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setSelectedDate(event.target.value);
  };

  return (
    console.log(combinedFilteredData),
    (
      <div>
        <label>Select years and months to compare</label>
        <div>
          <input
            type="month"
            value={selectedDate1}
            onChange={(event) => handleDateChange(event, setSelectedDate1)}
          />
        </div>
        <div>
          <input
            type="month"
            value={selectedDate2}
            onChange={(event) => handleDateChange(event, setSelectedDate2)}
          />
        </div>

        <BusDataTable
          combinedFilteredData={combinedFilteredData}
          selectedDate1={selectedDate1}
          selectedDate2={selectedDate2}
        />
      </div>
    )
  );
};

export default BusDataDisplay;
