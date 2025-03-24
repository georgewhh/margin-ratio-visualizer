import React, { useState, useRef, useEffect } from "react";

interface TimeRangeSelectorProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (range: [number, number]) => void;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  min,
  max,
  value,
  onChange,
}) => {
  const [dragging, setDragging] = useState<"left" | "right" | "middle" | null>(
    null
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const [start, end] = value;

  const getPosition = (clientX: number) => {
    if (!containerRef.current) return 0;
    const { left, width } = containerRef.current.getBoundingClientRect();
    const position = Math.max(0, Math.min(1, (clientX - left) / width));
    return position;
  };

  const getValueFromPosition = (position: number) => {
    return Math.round(min + position * (max - min));
  };

  const getPositionFromValue = (value: number) => {
    return (value - min) / (max - min);
  };

  const handleMouseDown = (
    e: React.MouseEvent,
    handle: "left" | "right" | "middle"
  ) => {
    e.preventDefault();
    setDragging(handle);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging || !containerRef.current) return;

    const position = getPosition(e.clientX);
    const value = getValueFromPosition(position);

    if (dragging === "left") {
      const newStart = Math.min(value, end - 1);
      onChange([newStart, end]);
    } else if (dragging === "right") {
      const newEnd = Math.max(value, start + 1);
      onChange([start, newEnd]);
    } else if (dragging === "middle") {
      const width = end - start;
      let newStart = value - Math.floor(width / 2);
      let newEnd = value + Math.ceil(width / 2);

      if (newStart < min) {
        newStart = min;
        newEnd = min + width;
      } else if (newEnd > max) {
        newEnd = max;
        newStart = max - width;
      }

      onChange([newStart, newEnd]);
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, start, end]);

  const startPos = getPositionFromValue(start) * 100;
  const endPos = getPositionFromValue(end) * 100;

  return (
    <div 
      className="range-selector mt-2 relative" 
      ref={containerRef}
      onMouseDown={(e) => {
        const position = getPosition(e.clientX);
        const value = getValueFromPosition(position);
        // If clicked outside handles and selected range, center the range around click position
        if (value < start || value > end) {
          const width = end - start;
          let newStart = value - Math.floor(width / 2);
          let newEnd = value + Math.ceil(width / 2);

          if (newStart < min) {
            newStart = min;
            newEnd = min + width;
          } else if (newEnd > max) {
            newEnd = max;
            newStart = max - width;
          }

          onChange([newStart, newEnd]);
        }
      }}
    >
      <div
        className="range-selector-selected"
        style={{ left: `${startPos}%`, right: `${100 - endPos}%` }}
        onMouseDown={(e) => handleMouseDown(e, "middle")}
      />
      <div
        className="range-selector-handle left-handle"
        style={{ left: `${startPos}%` }}
        onMouseDown={(e) => handleMouseDown(e, "left")}
      />
      <div
        className="range-selector-handle right-handle"
        style={{ left: `${endPos}%` }}
        onMouseDown={(e) => handleMouseDown(e, "right")}
      />
    </div>
  );
};

export default TimeRangeSelector;
