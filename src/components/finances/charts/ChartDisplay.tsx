
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Loader2 } from "lucide-react";
import { RevenueChartTooltip } from "@/components/dashboard/revenue/RevenueChartTooltip";
import { memo, useMemo, useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ChartDisplayProps {
  data: any[];
  view: 'monthly' | 'yearly';
  isLoading: boolean;
  error?: Error | null;
}

// Security: Sanitize chart data to prevent XSS
const sanitizeChartData = (data: any[]): any[] => {
  if (!Array.isArray(data)) return [];
  
  return data.map(item => {
    // Only include the expected properties
    const safeItem: any = {
      name: String(item.name || '').slice(0, 50), // Limit length
      income: typeof item.income === 'number' ? item.income : 0,
      expense: typeof item.expense === 'number' ? item.expense : 0,
      profit: typeof item.profit === 'number' ? item.profit : 0
    };
    return safeItem;
  });
};

// Using memo to prevent unnecessary re-renders
export const ChartDisplay = memo(function ChartDisplay({ data, view, isLoading, error }: ChartDisplayProps) {
  const { t } = useLocale();
  const { isAuthenticated } = useAuth();
  const [displayMode, setDisplayMode] = useState<'all' | 'income' | 'expense' | 'profit'>('all');
  
  // Secure the data against XSS
  const safeData = useMemo(() => sanitizeChartData(data), [data]);

  // Debug log
  useEffect(() => {
    console.log("ChartDisplay rendering with data:", {
      dataCount: safeData?.length || 0,
      viewMode: view,
      firstItem: safeData?.[0],
      displayMode,
      isLoading,
      hasError: !!error
    });
  }, [safeData, view, displayMode, isLoading, error]);

  // Log access attempts for security monitoring
  useEffect(() => {
    if (!isAuthenticated) {
      console.warn("Unauthorized access attempt to financial charts");
    }
  }, [isAuthenticated]);

  // Memoize the chart configuration
  const chartConfig = useMemo(() => {
    // This prevents recalculating these values on every render
    return {
      areaGradients: {
        income: {
          id: "colorIncome",
          startColor: "#3B82F6",
          startOpacity: 0.8,
          endOpacity: 0
        },
        expense: {
          id: "colorExpense",
          startColor: "#F43F5E",
          startOpacity: 0.8,
          endOpacity: 0
        },
        profit: {
          id: "colorProfit",
          startColor: "#10B981",
          startOpacity: 0.8,
          endOpacity: 0
        }
      },
      barColors: {
        income: "#3B82F6",
        expense: "#F43F5E",
        profit: "#10B981"
      }
    };
  }, []);
  
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t('errorLoadingData')}
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  if (!safeData || safeData.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex justify-center items-center h-64 text-xs text-muted-foreground"
      >
        {t('noDataAvailable')}
      </motion.div>
    );
  }

  // Security check - ensure authenticated before rendering financial data
  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-64 text-xs text-muted-foreground">
        {t('authRequired')}
      </div>
    );
  }
  
  // Helper to determine which data series to show based on displayMode
  const shouldShowSeries = (seriesName: 'income' | 'expense' | 'profit') => {
    return displayMode === 'all' || displayMode === seriesName;
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-center mb-2">
        <ToggleGroup type="single" value={displayMode} onValueChange={(value) => value && setDisplayMode(value as any)} size="sm">
          <ToggleGroupItem value="all" aria-label={t('showAll')}>
            {t('all')}
          </ToggleGroupItem>
          <ToggleGroupItem value="income" aria-label={t('showIncome')}>
            {t('income')}
          </ToggleGroupItem>
          <ToggleGroupItem value="expense" aria-label={t('showExpense')}>
            {t('expense')}
          </ToggleGroupItem>
          <ToggleGroupItem value="profit" aria-label={t('showProfit')}>
            {t('profit')}
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="h-64"
      >
        <ResponsiveContainer width="100%" height="100%">
          {view === 'monthly' ? (
            <AreaChart data={safeData} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={chartConfig.areaGradients.income.id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartConfig.areaGradients.income.startColor} stopOpacity={chartConfig.areaGradients.income.startOpacity}/>
                  <stop offset="95%" stopColor={chartConfig.areaGradients.income.startColor} stopOpacity={chartConfig.areaGradients.income.endOpacity}/>
                </linearGradient>
                <linearGradient id={chartConfig.areaGradients.expense.id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartConfig.areaGradients.expense.startColor} stopOpacity={chartConfig.areaGradients.expense.startOpacity}/>
                  <stop offset="95%" stopColor={chartConfig.areaGradients.expense.startColor} stopOpacity={chartConfig.areaGradients.expense.endOpacity}/>
                </linearGradient>
                <linearGradient id={chartConfig.areaGradients.profit.id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartConfig.areaGradients.profit.startColor} stopOpacity={chartConfig.areaGradients.profit.startOpacity}/>
                  <stop offset="95%" stopColor={chartConfig.areaGradients.profit.startColor} stopOpacity={chartConfig.areaGradients.profit.endOpacity}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" />
              <XAxis dataKey="name" fontSize={10} tick={{ fill: '#888', fontSize: 10 }} />
              <YAxis fontSize={10} tick={{ fill: '#888', fontSize: 10 }} tickFormatter={(value) => `$${value}`} />
              <Tooltip 
                content={<RevenueChartTooltip />} 
                cursor={{ stroke: '#888', strokeDasharray: '3 3', strokeWidth: 1, opacity: 0.5 }}
                animationDuration={300}
              />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              
              {shouldShowSeries('income') && (
                <Area
                  type="monotone"
                  dataKey="income"
                  name={t('income')}
                  stroke="#3B82F6"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill={`url(#${chartConfig.areaGradients.income.id})`}
                  activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 1, fill: '#fff' }}
                  isAnimationActive={true}
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
              )}
              
              {shouldShowSeries('expense') && (
                <Area
                  type="monotone"
                  dataKey="expense"
                  name={t('expense')}
                  stroke="#F43F5E"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill={`url(#${chartConfig.areaGradients.expense.id})`}
                  activeDot={{ r: 6, stroke: '#F43F5E', strokeWidth: 1, fill: '#fff' }}
                  isAnimationActive={true}
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
              )}
              
              {shouldShowSeries('profit') && (
                <Area
                  type="monotone"
                  dataKey="profit"
                  name={t('profit')}
                  stroke="#10B981"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill={`url(#${chartConfig.areaGradients.profit.id})`}
                  activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 1, fill: '#fff' }}
                  isAnimationActive={true}
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
              )}
            </AreaChart>
          ) : (
            <BarChart data={safeData} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" />
              <XAxis dataKey="name" fontSize={10} tick={{ fill: '#888', fontSize: 10 }} />
              <YAxis fontSize={10} tick={{ fill: '#888', fontSize: 10 }} tickFormatter={(value) => `$${value}`} />
              <Tooltip 
                content={<RevenueChartTooltip />}
                cursor={{ fill: '#f5f5f5', opacity: 0.2 }}
                animationDuration={300}
              />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              
              {shouldShowSeries('income') && (
                <Bar
                  dataKey="income"
                  name={t('income')}
                  fill={chartConfig.barColors.income}
                  radius={[4, 4, 0, 0]}
                  animationDuration={1000}
                />
              )}
              
              {shouldShowSeries('expense') && (
                <Bar
                  dataKey="expense"
                  name={t('expense')}
                  fill={chartConfig.barColors.expense}
                  radius={[4, 4, 0, 0]}
                  animationDuration={1000}
                />
              )}
              
              {shouldShowSeries('profit') && (
                <Bar
                  dataKey="profit"
                  name={t('profit')}
                  fill={chartConfig.barColors.profit}
                  radius={[4, 4, 0, 0]}
                  animationDuration={1000}
                />
              )}
            </BarChart>
          )}
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
});
