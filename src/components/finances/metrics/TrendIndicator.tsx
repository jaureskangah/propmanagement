
import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface TrendIndicatorProps {
  trend: number;
  isPositiveMetric?: boolean;
}

export const TrendIndicator = ({ trend, isPositiveMetric = true }: TrendIndicatorProps) => {
  // Pour les métriques négatives (comme les dépenses), on inverse l'interprétation de la tendance
  const isPositiveTrend = isPositiveMetric ? trend > 0 : trend < 0;
  const absoluteTrend = Math.abs(trend);

  if (trend === 0) {
    return null;
  }

  return (
    <div className={`flex items-center text-xs font-medium ${isPositiveTrend ? 'text-green-500' : 'text-red-500'}`}>
      {isPositiveTrend ? (
        <ArrowUp className="h-3 w-3 mr-0.5" />
      ) : (
        <ArrowDown className="h-3 w-3 mr-0.5" />
      )}
      <span>{absoluteTrend}%</span>
    </div>
  );
};
