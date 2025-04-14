
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";
import { useLocale } from "@/components/providers/LocaleProvider";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { 
  getMaintenanceChartData, 
  useMaintenanceChartConfig, 
  useExpensesChartConfig,
  formatMonthsForLocale
} from "./utils/chartUtils";
import { useMaintenanceChartData } from "./hooks/useMaintenanceChartData";

interface MaintenanceChartsProps {
  propertyId: string;
}

export const MaintenanceCharts = ({ propertyId }: MaintenanceChartsProps) => {
  const { t, locale } = useLocale();
  
  // Fetch chart data using the utility function
  const chartData = useMemo(() => {
    const data = getMaintenanceChartData(propertyId);
    return formatMonthsForLocale(data, locale);
  }, [propertyId, locale]);
  
  // Get chart configurations using the utility hooks
  const chartConfig = useMaintenanceChartConfig();
  const expensesChartConfig = useExpensesChartConfig();
  
  return (
    <div className="space-y-6">
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm shadow-md dark:bg-gray-800/40 transition-all duration-200 hover:shadow-lg hover:bg-card/60 font-sans">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-primary/90 dark:text-white/90">
            {t('maintenanceRequestsTrends')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ChartContainer 
              config={chartConfig}
              className="h-full w-full"
            >
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/40" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  padding={{ left: 10, right: 10 }}
                />
                <YAxis 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  padding={{ top: 10, bottom: 10 }}
                  width={30}
                />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend
                  height={36}
                  wrapperStyle={{ paddingTop: "8px" }}
                  verticalAlign="bottom"
                  formatter={(value) => <span className="text-xs">{value}</span>}
                />
                <Line 
                  type="monotone" 
                  dataKey="requests" 
                  name={chartConfig.totalRequests.label}
                  stroke={chartConfig.totalRequests.theme.light}
                  strokeWidth={2}
                  activeDot={{ r: 4, strokeWidth: 1 }}
                  dot={{ r: 0 }}
                  animationDuration={1000}
                  animationBegin={0}
                />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  name={chartConfig.completedRequests.label}
                  stroke={chartConfig.completedRequests.theme.light}
                  strokeWidth={2}
                  activeDot={{ r: 4, strokeWidth: 1 }} 
                  dot={{ r: 0 }}
                  animationDuration={1000}
                  animationBegin={300}
                />
                <Line 
                  type="monotone" 
                  dataKey="urgent" 
                  name={chartConfig.urgentRequests.label}
                  stroke={chartConfig.urgentRequests.theme.light}
                  strokeWidth={2}
                  activeDot={{ r: 4, strokeWidth: 1 }}
                  dot={{ r: 0 }}
                  animationDuration={1000}
                  animationBegin={600}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm shadow-md dark:bg-gray-800/40 transition-all duration-200 hover:shadow-lg hover:bg-card/60 font-sans">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-primary/90 dark:text-white/90">
            {t('maintenanceExpensesTrends')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ChartContainer
              config={expensesChartConfig}
              className="h-full w-full"
            >
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/40" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  padding={{ left: 10, right: 10 }}
                />
                <YAxis 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  padding={{ top: 10, bottom: 10 }}
                  width={30}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  content={<ChartTooltipContent />}
                />
                <Legend
                  height={36}
                  wrapperStyle={{ paddingTop: "8px" }}
                  verticalAlign="bottom"
                  formatter={(value) => <span className="text-xs">{value}</span>}
                />
                <Bar 
                  dataKey="expenses" 
                  name={expensesChartConfig.expenses.label}
                  fill={expensesChartConfig.expenses.theme.light}
                  animationDuration={1000}
                  animationBegin={0}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
