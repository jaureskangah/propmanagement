
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Loader2 } from "lucide-react";
import { RevenueChartTooltip } from "@/components/dashboard/revenue/RevenueChartTooltip";
import { memo, useMemo } from "react";

interface ChartDisplayProps {
  data: any[];
  view: 'monthly' | 'yearly';
  isLoading: boolean;
}

// Using memo to prevent unnecessary re-renders
export const ChartDisplay = memo(function ChartDisplay({ data, view, isLoading }: ChartDisplayProps) {
  const { t } = useLocale();

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
        }
      },
      barColors: {
        income: "#3B82F6",
        expense: "#F43F5E",
        profit: "#10B981"
      }
    };
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-xs text-muted-foreground">
        {t('noDataAvailable')}
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        {view === 'monthly' ? (
          <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={chartConfig.areaGradients.income.id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartConfig.areaGradients.income.startColor} stopOpacity={chartConfig.areaGradients.income.startOpacity}/>
                <stop offset="95%" stopColor={chartConfig.areaGradients.income.startColor} stopOpacity={chartConfig.areaGradients.income.endOpacity}/>
              </linearGradient>
              <linearGradient id={chartConfig.areaGradients.expense.id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartConfig.areaGradients.expense.startColor} stopOpacity={chartConfig.areaGradients.expense.startOpacity}/>
                <stop offset="95%" stopColor={chartConfig.areaGradients.expense.startColor} stopOpacity={chartConfig.areaGradients.expense.endOpacity}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" />
            <XAxis dataKey="name" fontSize={10} tick={{ fill: '#888', fontSize: 10 }} />
            <YAxis fontSize={10} tick={{ fill: '#888', fontSize: 10 }} />
            <Tooltip 
              content={<RevenueChartTooltip />} 
              cursor={{ stroke: '#888', strokeDasharray: '3 3', strokeWidth: 1, opacity: 0.5 }}
            />
            <Legend wrapperStyle={{ fontSize: '10px' }} />
            <Area
              type="monotone"
              dataKey="income"
              name={t('income')}
              stroke="#3B82F6"
              strokeWidth={1.5}
              fillOpacity={1}
              fill={`url(#${chartConfig.areaGradients.income.id})`}
              activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 1, fill: '#fff' }}
              isAnimationActive={false} // Disable animation for better performance
            />
            <Area
              type="monotone"
              dataKey="expense"
              name={t('expense')}
              stroke="#F43F5E"
              strokeWidth={1.5}
              fillOpacity={1}
              fill={`url(#${chartConfig.areaGradients.expense.id})`}
              activeDot={{ r: 6, stroke: '#F43F5E', strokeWidth: 1, fill: '#fff' }}
              isAnimationActive={false} // Disable animation for better performance
            />
          </AreaChart>
        ) : (
          <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" />
            <XAxis dataKey="name" fontSize={10} tick={{ fill: '#888', fontSize: 10 }} />
            <YAxis fontSize={10} tick={{ fill: '#888', fontSize: 10 }} />
            <Tooltip 
              content={<RevenueChartTooltip />}
              cursor={{ fill: '#f5f5f5', opacity: 0.2 }}
            />
            <Legend wrapperStyle={{ fontSize: '10px' }} />
            <Bar 
              dataKey="income" 
              name={t('income')} 
              fill={chartConfig.barColors.income} 
              radius={[4, 4, 0, 0]} 
              barSize={12} 
              isAnimationActive={false} // Disable animation for better performance
            />
            <Bar 
              dataKey="expense" 
              name={t('expense')} 
              fill={chartConfig.barColors.expense} 
              radius={[4, 4, 0, 0]} 
              barSize={12} 
              isAnimationActive={false} // Disable animation for better performance
            />
            <Bar 
              dataKey="profit" 
              name={t('profit')} 
              fill={chartConfig.barColors.profit} 
              radius={[4, 4, 0, 0]} 
              barSize={12} 
              isAnimationActive={false} // Disable animation for better performance
            />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
});
