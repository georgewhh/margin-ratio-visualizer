
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
    <div className="pt-4">
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
      <div className="text-xs text-center mt-2 text-muted-foreground">
        拖动两侧手柄或中间区域调整查看范围
      </div>
    </div>
  );
};

export default TimeRangeControls;
