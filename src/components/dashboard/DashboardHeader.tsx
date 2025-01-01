import { TrendingUp, TrendingDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const DashboardHeader = () => {
  const { data: monthlyChange = 0, isLoading } = useQuery({
    queryKey: ["monthly_revenue_change"],
    queryFn: async () => {
      console.log("Calculating monthly revenue change...");
      
      // Get current and previous month dates
      const now = new Date();
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      
      // Fetch current month payments
      const { data: currentMonthPayments, error: currentError } = await supabase
        .from("tenant_payments")
        .select("amount")
        .gte("payment_date", currentMonthStart.toISOString())
        .lt("payment_date", now.toISOString());

      if (currentError) throw currentError;

      // Fetch previous month payments
      const { data: previousMonthPayments, error: previousError } = await supabase
        .from("tenant_payments")
        .select("amount")
        .gte("payment_date", previousMonthStart.toISOString())
        .lt("payment_date", currentMonthStart.toISOString());

      if (previousError) throw previousError;

      // Calculate totals
      const currentTotal = currentMonthPayments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;
      const previousTotal = previousMonthPayments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;

      // Calculate percentage change
      if (previousTotal === 0) return currentTotal > 0 ? 100 : 0;
      const percentageChange = ((currentTotal - previousTotal) / previousTotal) * 100;

      console.log("Monthly revenue change calculated:", percentageChange);
      return percentageChange;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <div className="flex items-center gap-2 rounded-lg bg-gray-50/50 backdrop-blur-sm px-3 py-1 shadow-sm">
          <span className="text-sm font-medium text-gray-600">Calculating...</span>
        </div>
      </div>
    );
  }

  const isPositive = monthlyChange >= 0;
  const formattedChange = Math.abs(monthlyChange).toFixed(1);

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
        Dashboard
      </h1>
      <div className={`flex items-center gap-2 rounded-lg px-3 py-1.5 shadow-sm transition-all duration-300 hover:scale-105 ${
        isPositive ? 'bg-green-50/50 backdrop-blur-sm' : 'bg-red-50/50 backdrop-blur-sm'
      }`}>
        {isPositive ? (
          <TrendingUp className="h-4 w-4 text-green-600" />
        ) : (
          <TrendingDown className="h-4 w-4 text-red-600" />
        )}
        <span className={`text-sm font-medium ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {isPositive ? '+' : '-'}{formattedChange}% this month
        </span>
      </div>
    </div>
  );
};