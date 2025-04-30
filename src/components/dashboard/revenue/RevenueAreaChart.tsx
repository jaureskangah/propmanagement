
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer
} from "recharts";
import { RevenueChartTooltip } from "./RevenueChartTooltip";
import { chartColors } from "./chartColors";
import { useState } from "react";
import { motion } from "framer-motion";

interface RevenueAreaChartProps {
  monthlyData: any[];
}

export const RevenueAreaChart = ({ monthlyData }: RevenueAreaChartProps) => {
  const { 
    revenueColor, 
    expensesColor, 
    profitColor,
    gradientOpacityStart,
    gradientOpacityEnd
  } = chartColors;
  
  // State to track which data series are visible
  const [visibleSeries, setVisibleSeries] = useState({
    revenue: true,
    expenses: true,
    profit: true
  });

  // Toggle visibility of data series
  const toggleSeries = (series: keyof typeof visibleSeries) => {
    setVisibleSeries(prev => ({
      ...prev,
      [series]: !prev[series]
    }));
  };

  console.log("RevenueAreaChart rendering with data:", {
    dataPoints: monthlyData?.length || 0,
    firstItem: monthlyData?.[0],
    sampleProfit: monthlyData?.[0]?.profit,
    visibleSeries
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-wrap gap-3 mb-4 justify-end">
        {/* Interactive legend */}
        <div 
          className={`flex items-center gap-1.5 cursor-pointer px-2 py-1 rounded-md transition-all duration-300 
            ${visibleSeries.revenue ? 'bg-blue-50 dark:bg-blue-900/20' : 'opacity-50'}`}
          onClick={() => toggleSeries('revenue')}
        >
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: revenueColor }} />
          <span className="text-xs font-medium">Revenue</span>
        </div>
        <div 
          className={`flex items-center gap-1.5 cursor-pointer px-2 py-1 rounded-md transition-all duration-300 
            ${visibleSeries.expenses ? 'bg-red-50 dark:bg-red-900/20' : 'opacity-50'}`}
          onClick={() => toggleSeries('expenses')}
        >
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: expensesColor }} />
          <span className="text-xs font-medium">Expenses</span>
        </div>
        <div 
          className={`flex items-center gap-1.5 cursor-pointer px-2 py-1 rounded-md transition-all duration-300 
            ${visibleSeries.profit ? 'bg-green-50 dark:bg-green-900/20' : 'opacity-50'}`}
          onClick={() => toggleSeries('profit')}
        >
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: profitColor }} />
          <span className="text-xs font-medium">Profit</span>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 w-full h-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={monthlyData} 
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={revenueColor} stopOpacity={gradientOpacityStart} />
                <stop offset="95%" stopColor={revenueColor} stopOpacity={gradientOpacityEnd} />
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={expensesColor} stopOpacity={gradientOpacityStart} />
                <stop offset="95%" stopColor={expensesColor} stopOpacity={gradientOpacityEnd} />
              </linearGradient>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={profitColor} stopOpacity={gradientOpacityStart} />
                <stop offset="95%" stopColor={profitColor} stopOpacity={gradientOpacityEnd} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              className="stroke-muted/30" 
              vertical={false}
            />
            <XAxis
              dataKey="month"
              stroke="#888888"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={5}
              tickMargin={8}
            />
            <YAxis
              stroke="#888888"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
              dx={-5}
            />
            <Tooltip 
              content={<RevenueChartTooltip />} 
              animationDuration={200}
              animationEasing="ease-out"
            />
            
            {visibleSeries.revenue && (
              <Area
                type="monotone"
                dataKey="amount"
                stroke={revenueColor}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                animationDuration={1500}
                animationBegin={0}
                activeDot={{
                  r: 5,
                  stroke: revenueColor,
                  strokeWidth: 1.5,
                  fill: 'white',
                  className: 'animate-pulse'
                }}
              />
            )}
            
            {visibleSeries.expenses && (
              <Area
                type="monotone"
                dataKey="expenses"
                stroke={expensesColor}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorExpenses)"
                animationDuration={1500}
                animationBegin={300}
                activeDot={{
                  r: 5,
                  stroke: expensesColor,
                  strokeWidth: 1.5,
                  fill: 'white',
                  className: 'animate-pulse'
                }}
              />
            )}
            
            {visibleSeries.profit && (
              <Area
                type="monotone"
                dataKey="profit"
                stroke={profitColor}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorProfit)"
                animationDuration={1500}
                animationBegin={600}
                activeDot={{
                  r: 5,
                  stroke: profitColor,
                  strokeWidth: 1.5,
                  fill: 'white',
                  className: 'animate-pulse'
                }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};
