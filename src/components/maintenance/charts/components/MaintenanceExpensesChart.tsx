
import React from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartTooltip } from "./ChartTooltip";

interface MaintenanceExpensesChartProps {
  maintenanceData: any[];
}

export const MaintenanceExpensesChart = ({ maintenanceData }: MaintenanceExpensesChartProps) => {
  const { t } = useLocale();
  
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>{t('maintenanceExpensesTrends')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={maintenanceData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip {...ChartTooltip({ isExpense: true })} />
              <Bar dataKey="expenses" fill="#82ca9d" name={t('expenses')} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
