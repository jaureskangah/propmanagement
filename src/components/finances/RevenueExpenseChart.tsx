
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useChartData } from "./charts/hooks/useChartData";
import { processMonthlyData, processYearlyData } from "./charts/utils/chartProcessing";
import { ChartDisplay } from "./charts/ChartDisplay";

interface RevenueExpenseChartProps {
  propertyId: string | null;
}

export default function RevenueExpenseChart({ propertyId }: RevenueExpenseChartProps) {
  const { t } = useLocale();
  const [view, setView] = useState<'monthly' | 'yearly'>('monthly');
  const { data: chartData, isLoading } = useChartData(propertyId, view);

  const processedData = view === 'monthly' 
    ? processMonthlyData(chartData?.payments, chartData?.expenses)
    : processYearlyData(chartData?.payments, chartData?.expenses);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>{t('revenueAndExpenses')}</CardTitle>
          <Tabs defaultValue="monthly" value={view} onValueChange={(v) => setView(v as 'monthly' | 'yearly')}>
            <TabsList className="grid w-[200px] grid-cols-2">
              <TabsTrigger value="monthly">{t('monthly')}</TabsTrigger>
              <TabsTrigger value="yearly">{t('yearly')}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <ChartDisplay 
          data={processedData} 
          view={view} 
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
}
