
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocale } from "@/components/providers/LocaleProvider";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getChartTooltipConfig } from "./ChartTooltip";

interface MaintenanceData {
  date: string;
  requests: number;
  status?: string;
}

interface MaintenanceRequestsChartProps {
  maintenanceData: MaintenanceData[];
}

export const MaintenanceRequestsChart: React.FC<MaintenanceRequestsChartProps> = ({ 
  maintenanceData 
}) => {
  const { t } = useLocale();
  const tooltipConfig = getChartTooltipConfig({ isExpense: false });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('maintenanceRequestsOverTime')}</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={maintenanceData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip 
              contentStyle={tooltipConfig.contentStyle}
              formatter={tooltipConfig.formatter}
            />
            <Bar dataKey="requests" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
