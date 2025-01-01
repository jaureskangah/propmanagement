import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export const RevenueChart = () => {
  const { data: expenses, isLoading: isLoadingExpenses } = useQuery({
    queryKey: ["maintenance_expenses"],
    queryFn: async () => {
      console.log("Fetching maintenance expenses...");
      const { data, error } = await supabase
        .from("maintenance_expenses")
        .select("amount, date");
      if (error) throw error;
      console.log("Maintenance expenses data:", data);
      return data;
    },
  });

  const { data: payments, isLoading: isLoadingPayments } = useQuery({
    queryKey: ["tenant_payments"],
    queryFn: async () => {
      console.log("Fetching tenant payments...");
      const { data, error } = await supabase
        .from("tenant_payments")
        .select("amount, payment_date");
      if (error) throw error;
      console.log("Tenant payments data:", data);
      return data;
    },
  });

  if (isLoadingExpenses || isLoadingPayments) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  // Process the data to group by month
  const monthlyData = new Array(12).fill(0).map((_, index) => {
    const month = new Date(2024, index).toLocaleString('en-US', { month: 'short' });
    
    // Calculate total revenue (payments) for the month
    const monthlyRevenue = payments?.reduce((acc, payment) => {
      const paymentMonth = new Date(payment.payment_date).getMonth();
      if (paymentMonth === index) {
        return acc + Number(payment.amount);
      }
      return acc;
    }, 0) || 0;

    // Calculate total expenses for the month
    const monthlyExpenses = expenses?.reduce((acc, expense) => {
      const expenseMonth = new Date(expense.date).getMonth();
      if (expenseMonth === index) {
        return acc + Number(expense.amount);
      }
      return acc;
    }, 0) || 0;

    return {
      month,
      amount: monthlyRevenue,
      expenses: monthlyExpenses,
    };
  });

  return (
    <Card className="font-sans">
      <CardHeader className="flex flex-row items-center justify-between pb-8">
        <CardTitle className="text-lg font-medium">Revenue & Expenses</CardTitle>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500" />
            <span className="text-sm text-muted-foreground">Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-200" />
            <span className="text-sm text-muted-foreground">Expenses</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#93C5FD" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#93C5FD" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="month"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`]}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#3B82F6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="#93C5FD"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorExpenses)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};