
import React from "react";
import TimeRangeSelector from "../TimeRangeSelector";
import { MarginRatioDataPoint } from "@/services/apiService";

interface TimeRangeControlsProps {
  allData: MarginRatioDataPoint[];
  timeRange: [number, number];
  onRangeChange: (range: [number, number]) => void;
}

const TimeRangeControls: React.FC<TimeRangeControlsProps> = ({ 
  allData, 
  timeRange, 
  onRangeChange 
}) => {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  };

  return (
    <div className="pt-2 sm:pt-3">
      <TimeRangeSelector
        min={0}
        max={allData.length - 1}
        value={timeRange}
        onChange={onRangeChange}
      />
      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
        <span>{formatDate(allData[timeRange[0]]?.date)}</span>
        <span>{formatDate(allData[timeRange[1]]?.date)}</span>
      </div>
    </div>
  );
};

export default TimeRangeControls;
