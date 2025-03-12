
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

  // Add proper type checking for chartData
  const processedData = view === 'monthly' 
    ? processMonthlyData(chartData?.payments || [], chartData?.expenses || [])
    : processYearlyData(chartData?.payments || [], chartData?.expenses || []);

  return (
    <Card>
      <CardHeader className="pb-2 pt-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{t('revenueAndExpenses')}</CardTitle>
          <Tabs defaultValue="monthly" value={view} onValueChange={(v) => setView(v as 'monthly' | 'yearly')}>
            <TabsList className="grid w-[180px] grid-cols-2 h-8">
              <TabsTrigger value="monthly" className="text-xs h-7">{t('monthly')}</TabsTrigger>
              <TabsTrigger value="yearly" className="text-xs h-7">{t('yearly')}</TabsTrigger>
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
