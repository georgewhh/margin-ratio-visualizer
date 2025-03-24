import React, { useState, useEffect, useRef } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchMarginRatioData, MarginRatioDataPoint } from "@/services/apiService";
import ChartTooltip from "./ChartTooltip";
import TimeRangeSelector from "./TimeRangeSelector";

const MarginRatioChart: React.FC = () => {
  const [allData, setAllData] = useState<MarginRatioDataPoint[]>([]);
  const [displayData, setDisplayData] = useState<MarginRatioDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [timeRange, setTimeRange] = useState<[number, number]>([0, 0]);
  const [animatedLine, setAnimatedLine] = useState<boolean>(false);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchMarginRatioData(200);
      setAllData(data);
      
      const dataLength = data.length;
      const initialStart = Math.max(0, dataLength - 30);
      const initialEnd = dataLength - 1;
      
      setTimeRange([initialStart, initialEnd]);
      setDisplayData(data.slice(initialStart, initialEnd + 1));
      
      setLoading(false);
      
      setTimeout(() => {
        setAnimatedLine(true);
      }, 100);
    };

    loadData();
  }, []);

  useEffect(() => {
    if (allData.length === 0) return;
    
    const [start, end] = timeRange;
    const slicedData = allData.slice(start, end + 1);
    setDisplayData(slicedData);
  }, [timeRange, allData]);

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!chartContainerRef.current || loading || displayData.length === 0) return;
    
    const chartRect = chartContainerRef.current.getBoundingClientRect();
    const mouseX = event.clientX - chartRect.left;
    const chartWidth = chartRect.width;
    
    const dataLength = displayData.length;
    const index = Math.min(
      Math.max(0, Math.floor((mouseX / chartWidth) * dataLength)),
      dataLength - 1
    );
    
    setHoverIndex(index);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

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

  const handleRangeChange = (range: [number, number]) => {
    setTimeRange(range);
  };

  const calculateStats = () => {
    if (displayData.length === 0) return { avg: 0, min: 0, max: 0 };
    
    const values = displayData.map(d => d.value);
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    return { avg, min, max };
  };

  const { avg, min, max } = calculateStats();

  return (
    <Card className="w-full h-full border-none bg-transparent animate-scale-in">
      <CardHeader className="pb-2">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">金融指标</span>
            {!loading && (
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <span className="text-muted-foreground">均值:</span>
                  <span className="font-medium">{avg.toFixed(2)}%</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-muted-foreground">最小值:</span>
                  <span className="font-medium">{min.toFixed(2)}%</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-muted-foreground">最大值:</span>
                  <span className="font-medium">{max.toFixed(2)}%</span>
                </div>
              </div>
            )}
          </div>
          <CardTitle className="text-2xl font-semibold">两融余额占流通市值比</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-[300px] w-full rounded-lg" />
            <Skeleton className="h-8 w-full rounded-lg" />
          </div>
        ) : (
          <>
            <div 
              ref={chartContainerRef}
              className="relative h-[300px] w-full"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {hoverIndex !== null && (
                <div 
                  className="hover-line" 
                  style={{ 
                    left: `${(hoverIndex / (displayData.length - 1)) * 100}%` 
                  }}
                />
              )}
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={displayData}
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
                    content={<ChartTooltip data={displayData} />}
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
            </div>
            
            <div className="pt-4">
              <TimeRangeSelector
                min={0}
                max={allData.length - 1}
                value={timeRange}
                onChange={handleRangeChange}
              />
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>{allData[timeRange[0]]?.date ? formatXAxis(allData[timeRange[0]].date) : ""}</span>
                <span>{allData[timeRange[1]]?.date ? formatXAxis(allData[timeRange[1]].date) : ""}</span>
              </div>
              <div className="text-xs text-center mt-2 text-muted-foreground">
                拖动两侧手柄或中间区域调整查看范围
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MarginRatioChart;
