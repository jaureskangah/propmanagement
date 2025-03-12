
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Loader2 } from "lucide-react";

interface ChartDisplayProps {
  data: any[];
  view: 'monthly' | 'yearly';
  isLoading: boolean;
}

export function ChartDisplay({ data, view, isLoading }: ChartDisplayProps) {
  const { t } = useLocale();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-80">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center h-80 text-muted-foreground">
        {t('noDataAvailable')}
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        {view === 'monthly' ? (
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#F43F5E" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, undefined]} />
            <Legend />
            <Area
              type="monotone"
              dataKey="income"
              name={t('income')}
              stroke="#22C55E"
              fillOpacity={1}
              fill="url(#colorIncome)"
            />
            <Area
              type="monotone"
              dataKey="expense"
              name={t('expense')}
              stroke="#F43F5E"
              fillOpacity={1}
              fill="url(#colorExpense)"
            />
          </AreaChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, undefined]} />
            <Legend />
            <Bar dataKey="income" name={t('income')} fill="#22C55E" />
            <Bar dataKey="expense" name={t('expense')} fill="#F43F5E" />
            <Bar dataKey="profit" name={t('profit')} fill="#3B82F6" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
