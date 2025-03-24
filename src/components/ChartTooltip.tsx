
import React from "react";
import { MarginRatioDataPoint } from "@/services/apiService";

interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  data: MarginRatioDataPoint[];
}

const ChartTooltip: React.FC<ChartTooltipProps> = ({ active, payload, label, data }) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const dataPoint = payload[0].payload as MarginRatioDataPoint;
  const value = dataPoint.value;
  const formattedValue = value.toFixed(2) + "%";
  const date = new Date(dataPoint.date).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="chart-tooltip glass-tooltip">
      <div className="font-medium text-xs text-muted-foreground mb-1">
        {date}
      </div>
      <div className="flex items-center gap-2 mt-1">
        <div className="w-3 h-3 rounded-full bg-chart-gold" />
        <div className="text-sm">
          <span className="font-medium">两融余额占流通市值比: </span>
          <span className="font-semibold">{formattedValue}</span>
        </div>
      </div>
    </div>
  );
};

export default ChartTooltip;
