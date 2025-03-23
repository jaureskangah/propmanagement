
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocale } from "@/components/providers/LocaleProvider";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getChartTooltipConfig } from "./ChartTooltip";

interface MaintenanceData {
  date: string;
  expenses: number;
}

interface MaintenanceExpensesChartProps {
  maintenanceData: MaintenanceData[];
}

export const MaintenanceExpensesChart: React.FC<MaintenanceExpensesChartProps> = ({
  maintenanceData
}) => {
  const { t } = useLocale();
  const tooltipConfig = getChartTooltipConfig({ isExpense: true });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('maintenanceExpensesOverTime')}</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={maintenanceData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip 
              contentStyle={tooltipConfig.contentStyle}
              formatter={tooltipConfig.formatter}
            />
            <Line 
              type="monotone" 
              dataKey="expenses" 
              stroke="#ef4444" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
