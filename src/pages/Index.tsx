
import React from "react";
import MarginRatioChart from "@/components/MarginRatioChart";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90">
      <div className="container mx-auto py-8">
        <div className="max-w-5xl mx-auto px-4 space-y-8">
          <header className="text-center space-y-2 mb-8">
            <h1 className="text-3xl font-bold tracking-tight">金融数据可视化</h1>
            <p className="text-muted-foreground">实时了解两融余额占流通市值比例变化趋势</p>
          </header>
          
          <div className="glass-panel rounded-2xl p-6 shadow-sm">
            <MarginRatioChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
