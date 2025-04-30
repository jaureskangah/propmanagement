
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { RevenueChartTooltip } from "./RevenueChartTooltip";
import { chartColors } from "./chartColors";

interface RevenueAreaChartProps {
  monthlyData: any[];
}

export const RevenueAreaChart = ({ monthlyData }: RevenueAreaChartProps) => {
  const { revenueColor, expensesColor, profitColor } = chartColors;

  console.log("RevenueAreaChart rendering with data:", {
    dataPoints: monthlyData?.length || 0,
    firstItem: monthlyData?.[0],
    sampleProfit: monthlyData?.[0]?.profit
  });

  return (
    <AreaChart 
      data={monthlyData} 
      width={500} 
      height={270}
      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
    >
      <defs>
        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={revenueColor} stopOpacity={0.3} />
          <stop offset="95%" stopColor={revenueColor} stopOpacity={0} />
        </linearGradient>
        <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={expensesColor} stopOpacity={0.3} />
          <stop offset="95%" stopColor={expensesColor} stopOpacity={0} />
        </linearGradient>
        <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={profitColor || "#10B981"} stopOpacity={0.3} />
          <stop offset="95%" stopColor={profitColor || "#10B981"} stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid 
        strokeDasharray="3 3" 
        className="stroke-muted/50" 
        vertical={false}
      />
      <XAxis
        dataKey="month"
        stroke="#888888"
        fontSize={10}
        tickLine={false}
        axisLine={false}
        dy={5}
      />
      <YAxis
        stroke="#888888"
        fontSize={10}
        tickLine={false}
        axisLine={false}
        tickFormatter={(value) => `$${value.toLocaleString()}`}
        dx={-5}
      />
      <Tooltip content={<RevenueChartTooltip />} />
      <Area
        type="monotone"
        dataKey="amount"
        stroke={revenueColor}
        strokeWidth={1.5}
        fillOpacity={1}
        fill="url(#colorRevenue)"
        animationDuration={1000}
        animationBegin={0}
        activeDot={{
          r: 4,
          stroke: revenueColor,
          strokeWidth: 1.5,
          fill: 'white',
          className: 'animate-pulse'
        }}
      />
      <Area
        type="monotone"
        dataKey="expenses"
        stroke={expensesColor}
        strokeWidth={1.5}
        fillOpacity={1}
        fill="url(#colorExpenses)"
        animationDuration={1000}
        animationBegin={500}
        activeDot={{
          r: 4,
          stroke: expensesColor,
          strokeWidth: 1.5,
          fill: 'white',
          className: 'animate-pulse'
        }}
      />
      <Area
        type="monotone"
        dataKey="profit"
        stroke={profitColor || "#10B981"}
        strokeWidth={1.5}
        fillOpacity={1}
        fill="url(#colorProfit)"
        animationDuration={1000}
        animationBegin={1000}
        activeDot={{
          r: 4,
          stroke: profitColor || "#10B981",
          strokeWidth: 1.5,
          fill: 'white',
          className: 'animate-pulse'
        }}
      />
    </AreaChart>
  );
};
