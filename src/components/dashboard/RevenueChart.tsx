
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Loader2 } from "lucide-react";
import { useRevenueData } from "./hooks/useRevenueData";
import { RevenueChartTooltip } from "./revenue/RevenueChartTooltip";
import { processMonthlyData } from "./revenue/revenueUtils";
import { useEffect } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";

export const RevenueChart = () => {
  const { t } = useLocale();
  const { expenses, payments, isLoading } = useRevenueData();

  useEffect(() => {
    console.log("RevenueChart data state:", {
      hasExpenses: !!expenses?.length,
      expensesCount: expenses?.length,
      hasPayments: !!payments?.length,
      paymentsCount: payments?.length,
      isLoading
    });

    return () => {
      console.log("RevenueChart unmounting");
    };
  }, [expenses, payments, isLoading]);

  if (isLoading) {
    console.log("RevenueChart is loading");
    return (
      <Card className="animate-pulse dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="flex items-center justify-center h-[350px]">
          <Loader2 className="h-5 w-5 animate-spin text-primary dark:text-blue-400" />
        </CardContent>
      </Card>
    );
  }

  const monthlyData = processMonthlyData(expenses, payments);
  console.log("RevenueChart processed monthly data:", {
    dataPoints: monthlyData.length,
    firstMonth: monthlyData[0]?.month,
    lastMonth: monthlyData[monthlyData.length - 1]?.month
  });

  return (
    <Card className="font-sans group transition-all duration-300 hover:shadow-lg animate-fade-in dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-base font-medium bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-blue-500">
          {t('revenue')} & {t('expenses')}
        </CardTitle>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 transition-transform duration-300 hover:scale-105">
            <div className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs text-muted-foreground dark:text-gray-400">{t('revenue')}</span>
          </div>
          <div className="flex items-center gap-1.5 transition-transform duration-300 hover:scale-105">
            <div className="h-2.5 w-2.5 rounded-full bg-blue-200 animate-pulse" />
            <span className="text-xs text-muted-foreground dark:text-gray-400">{t('expenses')}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[270px] transition-transform duration-500 group-hover:scale-[1.02]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#93C5FD" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#93C5FD" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                className="stroke-muted/50 dark:stroke-gray-700/50" 
                vertical={false}
              />
              <XAxis
                dataKey="month"
                stroke="#888888"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                dy={5}
                className="dark:text-gray-400"
              />
              <YAxis
                stroke="#888888"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                dx={-5}
                className="dark:text-gray-400"
              />
              <Tooltip content={RevenueChartTooltip} />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#3B82F6"
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                animationDuration={1000}
                animationBegin={0}
                activeDot={{
                  r: 4,
                  stroke: '#3B82F6',
                  strokeWidth: 1.5,
                  fill: 'white',
                  className: 'animate-pulse dark:fill-gray-900'
                }}
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="#93C5FD"
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#colorExpenses)"
                animationDuration={1000}
                animationBegin={500}
                activeDot={{
                  r: 4,
                  stroke: '#93C5FD',
                  strokeWidth: 1.5,
                  fill: 'white',
                  className: 'animate-pulse dark:fill-gray-900'
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
