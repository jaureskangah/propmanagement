
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useChartData } from "./charts/hooks/useChartData";
import { ChartDisplay } from "./charts/ChartDisplay";
import { ErrorState } from "./metrics/ErrorState";

interface RevenueExpenseChartProps {
  propertyId: string | null;
  selectedYear: number;
}

export default function RevenueExpenseChart({ propertyId, selectedYear }: RevenueExpenseChartProps) {
  const { t } = useLocale();
  const [view, setView] = useState<'monthly' | 'yearly'>('monthly');
  
  const { monthlyData, yearlyData, isLoading, error, refetch } = useChartData(propertyId, view, selectedYear);

  // Log component rendering and data
  useEffect(() => {
    console.log("RevenueExpenseChart rendering with:", {
      propertyId,
      selectedYear,
      view,
      dataPoints: monthlyData?.length || 0,
      isLoading,
      hasError: !!error,
      dataFirstItem: monthlyData?.[0],
    });
  }, [propertyId, selectedYear, view, monthlyData, isLoading, error]);

  const handleRetry = () => {
    console.log("Refetching chart data");
    refetch();
  };

  if (error) {
    console.error("Error loading chart data:", error);
    return <ErrorState error={error as Error} onRetry={handleRetry} type="chart" />;
  }

  const processedData = view === 'monthly' ? monthlyData : yearlyData;

  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur-sm shadow-md dark:bg-gray-800/40 transition-all duration-200 hover:shadow-lg hover:bg-card/60 font-sans">
      <CardHeader className="pb-2 pt-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-primary/90 dark:text-white/90">{t('revenueAndExpenses')}</CardTitle>
          <Tabs defaultValue="monthly" value={view} onValueChange={(v) => setView(v as 'monthly' | 'yearly')} className="h-7">
            <TabsList className="grid w-[160px] grid-cols-2 h-7 bg-muted/50 dark:bg-gray-700/50">
              <TabsTrigger value="monthly" className="text-xs h-6 data-[state=active]:bg-background/90 dark:data-[state=active]:bg-gray-600/90">{t('monthly')}</TabsTrigger>
              <TabsTrigger value="yearly" className="text-xs h-6 data-[state=active]:bg-background/90 dark:data-[state=active]:bg-gray-600/90">{t('yearly')}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <ChartDisplay 
          data={processedData} 
          view={view} 
          isLoading={isLoading}
          error={error}
        />
      </CardContent>
    </Card>
  );
}
