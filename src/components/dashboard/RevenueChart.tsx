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
import { cn } from "@/lib/utils";

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
      <Card className="animate-pulse">
        <CardContent className="flex items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
      profit: monthlyRevenue - monthlyExpenses,
    };
  });

  return (
    <Card className="font-sans group transition-all duration-300 hover:shadow-lg animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between pb-8">
        <CardTitle className="text-lg font-medium bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Revenue & Expenses
        </CardTitle>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 transition-transform duration-300 hover:scale-105">
            <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-sm text-muted-foreground">Revenue</span>
          </div>
          <div className="flex items-center gap-2 transition-transform duration-300 hover:scale-105">
            <div className="h-3 w-3 rounded-full bg-blue-200 animate-pulse" />
            <span className="text-sm text-muted-foreground">Expenses</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] transition-transform duration-500 group-hover:scale-[1.02]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#93C5FD" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#93C5FD" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                className="stroke-muted/50" 
                vertical={false}
              />
              <XAxis
                dataKey="month"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                dx={-10}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const revenue = Number(payload[0].value);
                    const expenses = Number(payload[1].value);
                    const profit = revenue - expenses;
                    
                    return (
                      <div className="rounded-lg border bg-background p-4 shadow-md animate-fade-in">
                        <p className="font-semibold mb-2">{label}</p>
                        <div className="space-y-1">
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-muted-foreground">Revenue:</span>
                            <span className="font-medium text-blue-500">
                              ${revenue.toLocaleString()}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-muted-foreground">Expenses:</span>
                            <span className="font-medium text-blue-300">
                              ${expenses.toLocaleString()}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 border-t pt-1 mt-1">
                            <span className="text-muted-foreground">Profit:</span>
                            <span className={cn(
                              "font-medium",
                              profit > 0 ? "text-green-500" : "text-red-500"
                            )}>
                              ${profit.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
                animationDuration={200}
                cursor={{ stroke: '#3B82F6', strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#3B82F6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                animationDuration={1000}
                animationBegin={0}
                activeDot={{
                  r: 6,
                  stroke: '#3B82F6',
                  strokeWidth: 2,
                  fill: 'white',
                  className: 'animate-pulse'
                }}
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="#93C5FD"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorExpenses)"
                animationDuration={1000}
                animationBegin={500}
                activeDot={{
                  r: 6,
                  stroke: '#93C5FD',
                  strokeWidth: 2,
                  fill: 'white',
                  className: 'animate-pulse'
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};