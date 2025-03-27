
import React from "react";
import MarginRatioChart from "@/components/MarginRatioChart";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90">
      <div className="container mx-auto py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="glass-panel rounded-2xl p-6 shadow-sm">
            <MarginRatioChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
