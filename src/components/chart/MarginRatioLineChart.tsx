
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import ChartTooltip from "../ChartTooltip";
import { MarginRatioDataPoint } from "@/services/apiService";

interface MarginRatioLineChartProps {
  data: MarginRatioDataPoint[];
  animatedLine: boolean;
  avg: number;
}

const MarginRatioLineChart: React.FC<MarginRatioLineChartProps> = ({ 
  data, 
  animatedLine,
  avg 
}) => {
  const formatXAxis = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN", {
      month: "numeric",
      day: "numeric",
    });
  };

  const formatYAxis = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F0BE83" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#F0BE83" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey="date" 
          tickFormatter={formatXAxis} 
          tickMargin={10}
          minTickGap={50}
          tick={{ fontSize: 12 }}
          axisLine={{ stroke: 'var(--border)' }}
          tickLine={{ stroke: 'var(--border)' }}
        />
        <YAxis 
          tickFormatter={formatYAxis} 
          tickMargin={10}
          domain={['auto', 'auto']}
          tick={{ fontSize: 12 }}
          axisLine={{ stroke: 'var(--border)' }}
          tickLine={{ stroke: 'var(--border)' }}
        />
        <Tooltip 
          content={<ChartTooltip data={data} />}
          cursor={false}
        />
        <ReferenceLine 
          y={avg} 
          stroke="#9CA3AF" 
          strokeDasharray="3 3" 
          strokeWidth={1}
        >
          <text
            x={60}
            y={-5}
            fill="var(--muted-foreground)"
            textAnchor="middle"
            fontSize={10}
          >
            平均值: {avg.toFixed(2)}%
          </text>
        </ReferenceLine>
        <Line
          type="monotone"
          dataKey="value"
          stroke="#F0BE83"
          strokeWidth={2}
          dot={false}
          activeDot={{ 
            r: 6, 
            stroke: "#F0BE83", 
            strokeWidth: 2,
            fill: "var(--card)"
          }}
          isAnimationActive={true}
          animationDuration={1500}
          animationEasing="ease-in-out"
          strokeDasharray={animatedLine ? "0" : "1200 1200"}
          strokeDashoffset={animatedLine ? "0" : "1200"}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MarginRatioLineChart;
