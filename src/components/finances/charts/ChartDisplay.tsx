
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Loader2 } from "lucide-react";
import { RevenueChartTooltip } from "@/components/dashboard/revenue/RevenueChartTooltip";

interface ChartDisplayProps {
  data: any[];
  view: 'monthly' | 'yearly';
  isLoading: boolean;
}

export function ChartDisplay({ data, view, isLoading }: ChartDisplayProps) {
  const { t } = useLocale();

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
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#F43F5E" stopOpacity={0}/>
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
              fill="url(#colorIncome)"
              activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 1, fill: '#fff' }}
            />
            <Area
              type="monotone"
              dataKey="expense"
              name={t('expense')}
              stroke="#F43F5E"
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#colorExpense)"
              activeDot={{ r: 6, stroke: '#F43F5E', strokeWidth: 1, fill: '#fff' }}
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
            <Bar dataKey="income" name={t('income')} fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={12} />
            <Bar dataKey="expense" name={t('expense')} fill="#F43F5E" radius={[4, 4, 0, 0]} barSize={12} />
            <Bar dataKey="profit" name={t('profit')} fill="#10B981" radius={[4, 4, 0, 0]} barSize={12} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
