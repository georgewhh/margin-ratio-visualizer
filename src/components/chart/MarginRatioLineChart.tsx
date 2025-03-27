
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
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  };

  const formatYAxis = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 10, right: 5, left: 5, bottom: 0 }}
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
          tickMargin={5}
          minTickGap={30}
          tick={{ fontSize: 10 }}
          axisLine={{ stroke: 'var(--border)' }}
          tickLine={{ stroke: 'var(--border)' }}
          height={20}
        />
        <YAxis 
          tickFormatter={formatYAxis} 
          tickMargin={5}
          domain={['auto', 'auto']}
          tick={{ fontSize: 10 }}
          axisLine={{ stroke: 'var(--border)' }}
          tickLine={{ stroke: 'var(--border)' }}
          width={30}
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
            x={30}
            y={-2}
            fill="var(--muted-foreground)"
            textAnchor="middle"
            fontSize={8}
          >
            平均: {avg.toFixed(2)}%
          </text>
        </ReferenceLine>
        <Line
          type="monotone"
          dataKey="value"
          stroke="#F0BE83"
          strokeWidth={2}
          dot={false}
          activeDot={{ 
            r: 4, 
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
