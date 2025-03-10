
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts";
import { useLocale } from "@/components/providers/LocaleProvider";

interface RevenueExpenseChartProps {
  propertyId: string | null;
}

export default function RevenueExpenseChart({ propertyId }: RevenueExpenseChartProps) {
  const { t } = useLocale();
  const [view, setView] = useState<'monthly' | 'yearly'>('monthly');

  const { data, isLoading } = useQuery({
    queryKey: ['financial_chart_data', propertyId, view],
    queryFn: async () => {
      if (!propertyId) return [];

      // Get property tenants
      const { data: tenants } = await supabase
        .from('tenants')
        .select('id')
        .eq('property_id', propertyId);

      const tenantIds = tenants?.map(t => t.id) || [];

      // Fetch payment data
      const { data: payments } = await supabase
        .from('tenant_payments')
        .select('amount, payment_date, status')
        .in('tenant_id', tenantIds)
        .order('payment_date', { ascending: true });

      // Fetch expense data
      const { data: expenses } = await supabase
        .from('maintenance_expenses')
        .select('amount, date, category')
        .eq('property_id', propertyId)
        .order('date', { ascending: true });

      // Process the data based on selected view
      if (view === 'monthly') {
        // Process data for monthly view
        return processMonthlyData(payments || [], expenses || []);
      } else {
        // Process data for yearly view
        return processYearlyData(payments || [], expenses || []);
      }
    },
    enabled: !!propertyId
  });

  const processMonthlyData = (payments: any[], expenses: any[]) => {
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    return monthNames.map((month, index) => {
      const monthlyPayments = payments.filter(p => {
        const paymentDate = new Date(p.payment_date);
        return paymentDate.getMonth() === index;
      });
      
      const monthlyExpenses = expenses.filter(e => {
        const expenseDate = new Date(e.date);
        return expenseDate.getMonth() === index;
      });
      
      const income = monthlyPayments.reduce((sum, p) => sum + p.amount, 0);
      const expense = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
      
      return {
        name: month,
        income,
        expense,
        profit: income - expense
      };
    });
  };

  const processYearlyData = (payments: any[], expenses: any[]) => {
    const currentYear = new Date().getFullYear();
    const years = [currentYear - 2, currentYear - 1, currentYear];
    
    return years.map(year => {
      const yearlyPayments = payments.filter(p => {
        const paymentDate = new Date(p.payment_date);
        return paymentDate.getFullYear() === year;
      });
      
      const yearlyExpenses = expenses.filter(e => {
        const expenseDate = new Date(e.date);
        return expenseDate.getFullYear() === year;
      });
      
      const income = yearlyPayments.reduce((sum, p) => sum + p.amount, 0);
      const expense = yearlyExpenses.reduce((sum, e) => sum + e.amount, 0);
      
      return {
        name: year.toString(),
        income,
        expense,
        profit: income - expense
      };
    });
  };

  const renderChart = () => {
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
  };

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
        {renderChart()}
      </CardContent>
    </Card>
  );
}
