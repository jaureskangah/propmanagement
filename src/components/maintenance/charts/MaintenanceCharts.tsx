
import React from "react";
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

interface MaintenanceChartsProps {
  propertyId: string;
}

// Données fictives pour les graphiques - dans une application réelle, ces données viendraient d'une API
const chartData = [
  { month: "Jan", requests: 4, completed: 3, urgent: 1, expenses: 400 },
  { month: "Feb", requests: 3, completed: 2, urgent: 0, expenses: 300 },
  { month: "Mar", requests: 5, completed: 4, urgent: 2, expenses: 550 },
  { month: "Apr", requests: 2, completed: 2, urgent: 0, expenses: 200 },
  { month: "May", requests: 7, completed: 5, urgent: 3, expenses: 650 },
  { month: "Jun", requests: 4, completed: 3, urgent: 1, expenses: 450 },
];

export const MaintenanceCharts = ({ propertyId }: MaintenanceChartsProps) => {
  const { t } = useLocale();
  
  console.log("Rendering MaintenanceCharts with propertyId:", propertyId);
  
  // Configuration des couleurs pour les graphiques
  const chartConfig = {
    totalRequests: {
      label: t('totalRequests'),
      theme: { light: "#8884d8", dark: "#a393f0" }
    },
    completedRequests: {
      label: t('completedRequests'),
      theme: { light: "#4ade80", dark: "#22c55e" }
    },
    urgentRequests: {
      label: t('urgentRequests'),
      theme: { light: "#ef4444", dark: "#f87171" }
    },
    expenses: {
      label: t('expenses'),
      theme: { light: "#82ca9d", dark: "#86efac" }
    },
  };
  
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
                  name="totalRequests"
                  strokeWidth={2}
                  activeDot={{ r: 4, strokeWidth: 1 }}
                  dot={{ r: 0 }}
                  animationDuration={1000}
                  animationBegin={0}
                />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  name="completedRequests"
                  strokeWidth={2}
                  activeDot={{ r: 4, strokeWidth: 1 }} 
                  dot={{ r: 0 }}
                  animationDuration={1000}
                  animationBegin={300}
                />
                <Line 
                  type="monotone" 
                  dataKey="urgent" 
                  name="urgentRequests"
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
              config={{
                expenses: {
                  label: t('expenses'),
                  theme: { light: "#82ca9d", dark: "#86efac" }
                }
              }}
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
                  name="expenses"
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
