
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchMarginRatioData, MarginRatioDataPoint } from "@/services/apiService";
import ChartStats from "./chart/ChartStats";
import MarginRatioLineChart from "./chart/MarginRatioLineChart";
import TimeRangeControls from "./chart/TimeRangeControls";

const MarginRatioChart: React.FC = () => {
  const [allData, setAllData] = useState<MarginRatioDataPoint[]>([]);
  const [displayData, setDisplayData] = useState<MarginRatioDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [timeRange, setTimeRange] = useState<[number, number]>([0, 0]);
  const [animatedLine, setAnimatedLine] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startTouchX, setStartTouchX] = useState<number>(0);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchMarginRatioData();
      setAllData(data);
      
      const dataLength = data.length;
      // Initially show the most recent 200 days (or all if less than 200)
      const initialStart = Math.max(0, dataLength - 200);
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

  // Handle mouse events for desktop
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

  // Handle touch events for mobile
  const handleTouchStart = (event: React.TouchEvent) => {
    if (!chartContainerRef.current || loading || displayData.length === 0) return;
    
    setStartTouchX(event.touches[0].clientX);
    setIsDragging(true);

    const chartRect = chartContainerRef.current.getBoundingClientRect();
    const touchX = event.touches[0].clientX - chartRect.left;
    const chartWidth = chartRect.width;
    
    const dataLength = displayData.length;
    const index = Math.min(
      Math.max(0, Math.floor((touchX / chartWidth) * dataLength)),
      dataLength - 1
    );
    
    setHoverIndex(index);
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    if (!isDragging || !chartContainerRef.current) return;
    
    const chartRect = chartContainerRef.current.getBoundingClientRect();
    const touchX = event.touches[0].clientX - chartRect.left;
    const chartWidth = chartRect.width;
    
    const dataLength = displayData.length;
    const index = Math.min(
      Math.max(0, Math.floor((touchX / chartWidth) * dataLength)),
      dataLength - 1
    );
    
    setHoverIndex(index);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleRangeChange = (range: [number, number]) => {
    setTimeRange(range);
  };

  const calculateAvg = () => {
    if (displayData.length === 0) return 0;
    const values = displayData.map(d => d.value);
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  };

  const avg = calculateAvg();

  return (
    <Card className="w-full h-full border-none bg-transparent animate-scale-in">
      <CardHeader className="pb-2">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center justify-between">
            <ChartStats data={displayData} loading={loading} />
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
              className="relative h-[300px] w-full md:h-[400px] touch-manipulation"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {hoverIndex !== null && (
                <div 
                  className="hover-line" 
                  style={{ 
                    left: `${(hoverIndex / (displayData.length - 1)) * 100}%` 
                  }}
                />
              )}
              <MarginRatioLineChart 
                data={displayData} 
                animatedLine={animatedLine}
                avg={avg}
              />
            </div>
            
            <TimeRangeControls
              allData={allData}
              timeRange={timeRange}
              onRangeChange={handleRangeChange}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MarginRatioChart;
