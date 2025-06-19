
import React from "react";

interface MetricIconProps {
  icon: React.ReactNode;
  chartColor?: string;
}

export function MetricIcon({ icon, chartColor = '#3B82F6' }: MetricIconProps) {
  return (
    <div 
      className="transition-all duration-300 group-hover:scale-110 flex items-center justify-center"
      style={{ color: chartColor }}
    >
      {icon}
    </div>
  );
}
