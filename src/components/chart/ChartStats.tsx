
import React from "react";
import { MarginRatioDataPoint } from "@/services/apiService";

interface ChartStatsProps {
  data: MarginRatioDataPoint[];
  loading: boolean;
}

const ChartStats: React.FC<ChartStatsProps> = ({ data, loading }) => {
  const calculateStats = () => {
    if (data.length === 0) return { avg: 0, min: 0, max: 0 };
    
    const values = data.map(d => d.value);
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    return { avg, min, max };
  };

  const { avg, min, max } = calculateStats();

  if (loading) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
      <div className="flex items-center gap-1">
        <span className="text-muted-foreground">均值:</span>
        <span className="font-medium">{avg.toFixed(2)}%</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-muted-foreground">最小值:</span>
        <span className="font-medium">{min.toFixed(2)}%</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-muted-foreground">最大值:</span>
        <span className="font-medium">{max.toFixed(2)}%</span>
      </div>
    </div>
  );
};

export default ChartStats;
