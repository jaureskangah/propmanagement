
import React from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import {
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
  Line
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartTooltip } from "./ChartTooltip";

interface MaintenanceRequestsChartProps {
  maintenanceData: any[];
}

export const MaintenanceRequestsChart = ({ maintenanceData }: MaintenanceRequestsChartProps) => {
  const { t } = useLocale();
  
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>{t('maintenanceRequestsTrends')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={maintenanceData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip {...ChartTooltip()} />
              <Legend />
              <Line type="monotone" dataKey="requests" stroke="#8884d8" name={t('totalRequests')} />
              <Line type="monotone" dataKey="completed" stroke="#4ade80" name={t('completedRequests')} />
              <Line type="monotone" dataKey="urgent" stroke="#ef4444" name={t('urgentRequests')} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
