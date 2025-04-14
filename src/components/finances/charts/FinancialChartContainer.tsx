
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartDisplay } from "./ChartDisplay";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CalendarIcon, DownloadIcon, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { YearMonthSelector } from "./YearMonthSelector";
import { Skeleton } from "@/components/ui/skeleton";

interface FinancialChartContainerProps {
  propertyId: string | null;
  propertyName?: string;
  monthlyData: any[];
  yearlyData: any[];
  isLoading: boolean;
  error?: Error | null;
}

export const FinancialChartContainer = ({
  propertyId,
  propertyName,
  monthlyData,
  yearlyData,
  isLoading,
  error
}: FinancialChartContainerProps) => {
  const { t } = useLocale();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [view, setView] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  
  const handleRefresh = () => {
    // Fix: Use proper invalidation pattern for @tanstack/react-query
    queryClient.invalidateQueries({
      queryKey: ['financial_chart_data']
    });
    
    toast({
      title: t('refreshing'),
      description: t('dataBeingRefreshed'),
    });
  };
  
  const handleDownload = () => {
    toast({
      title: t('export'),
      description: t('exportPreparing'),
    });
    
    // Simuler un téléchargement après un court délai
    setTimeout(() => {
      toast({
        title: t('success'),
        description: t('exportReady'),
      });
    }, 1500);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-md">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-xl">
                {propertyName ? t('financialDataForProperty', { property: propertyName }) : t('financialData')}
              </CardTitle>
              <CardDescription>
                {view === 'monthly' 
                  ? t('monthlyBreakdownDesc') 
                  : t('yearlyBreakdownDesc')}
              </CardDescription>
            </div>
            
            <div className="flex flex-row space-x-2">
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className="mr-1 h-4 w-4" />
                <span className="hidden sm:inline">{t('refresh')}</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload} disabled={isLoading}>
                <DownloadIcon className="mr-1 h-4 w-4" />
                <span className="hidden sm:inline">{t('export')}</span>
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 gap-2">
            <Tabs defaultValue="monthly" value={view} onValueChange={(v) => setView(v as 'monthly' | 'yearly')} className="w-full sm:w-auto">
              <TabsList className="grid w-full sm:w-[200px] grid-cols-2">
                <TabsTrigger value="monthly" className="text-xs md:text-sm">
                  <CalendarIcon className="mr-1 h-3 w-3 md:h-4 md:w-4" />
                  {t('monthly')}
                </TabsTrigger>
                <TabsTrigger value="yearly" className="text-xs md:text-sm">
                  <CalendarIcon className="mr-1 h-3 w-3 md:h-4 md:w-4" />
                  {t('yearly')}
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <YearMonthSelector 
              selectedYear={selectedYear}
              onChange={setSelectedYear}
              view={view}
            />
          </div>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-[250px] w-full rounded-lg" />
              <div className="flex justify-center space-x-2">
                <Skeleton className="h-4 w-12 rounded" />
                <Skeleton className="h-4 w-12 rounded" />
                <Skeleton className="h-4 w-12 rounded" />
              </div>
            </div>
          ) : (
            <TabsContent value={view} forceMount={true} hidden={false}>
              <ChartDisplay
                data={view === 'monthly' ? monthlyData : yearlyData}
                view={view}
                isLoading={isLoading}
                error={error}
              />
            </TabsContent>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
