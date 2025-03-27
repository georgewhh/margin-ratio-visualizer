
import React from "react";
import MarginRatioChart from "@/components/MarginRatioChart";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90">
      <div className="container mx-auto py-2 sm:py-4 px-2">
        <div className="w-full max-w-full mx-auto">
          <div className="glass-panel rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-sm">
            <MarginRatioChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
