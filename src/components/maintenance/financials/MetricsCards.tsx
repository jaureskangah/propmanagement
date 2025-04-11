
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, TrendingUp, Wallet } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useSupabaseQuery } from "@/hooks/supabase";

interface MetricsCardsProps {
  propertyId: string;
  expenses: any[];
  maintenance: any[];
  calculateROI: () => string;
}

export const MetricsCards = ({ propertyId, expenses, maintenance, calculateROI }: MetricsCardsProps) => {
  const { t } = useLocale();
  
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalMaintenance = maintenance.reduce((acc, curr) => acc + (curr.cost || 0), 0);

  // Get current year's start and end dates
  const currentYear = new Date().getFullYear();
  const startOfYear = new Date(currentYear, 0, 1).toISOString(); // Jan 1st of current year
  
  // Fetch total rent payments regardless of property
  const { data: totalRentPaid = 0, isLoading: isLoadingRent } = useQuery({
    queryKey: ["total_rent_paid", currentYear],
    queryFn: async () => {
      console.log("Fetching total rent payments for year:", currentYear);
      
      try {
        // Fetch all payments for the current year regardless of tenant
        const { data: payments, error: paymentsError } = await supabase
          .from("tenant_payments")
          .select("amount, status, payment_date")
          .gte("payment_date", startOfYear);

        if (paymentsError) {
          console.error("Error fetching payments:", paymentsError);
          throw paymentsError;
        }

        console.log("All payments retrieved:", payments);
        
        // Filter payments by status
        const filteredPayments = payments?.filter(payment => 
          payment.status === 'paid'
        ) || [];
        
        console.log("Filtered payments for current year:", filteredPayments);

        // Sum the payment amounts
        const total = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
        console.log("Total rent paid for current year:", total);
        return total;
      } catch (error) {
        console.error("Error calculating rent paid:", error);
        return 0;
      }
    },
  });

  console.log("Rendering MetricsCards with totalRentPaid:", totalRentPaid);

  const metrics = [
    {
      title: t('totalExpenses'),
      value: `$${(totalExpenses + totalMaintenance).toLocaleString()}`,
      icon: <FileText className="h-4 w-4" />,
      description: t('yearToDate'),
      color: "text-rose-500",
      bgColor: "from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20",
      borderColor: "border-rose-100 dark:border-rose-800/30 hover:border-rose-200 dark:hover:border-rose-700/40",
    },
    {
      title: "ROI",
      value: `${calculateROI()}%`,
      icon: <TrendingUp className="h-4 w-4" />,
      description: t('annualReturn'),
      color: "text-blue-500",
      bgColor: "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
      borderColor: "border-blue-100 dark:border-blue-800/30 hover:border-blue-200 dark:hover:border-blue-700/40",
    },
    {
      title: t('totalRentPaid'),
      value: isLoadingRent ? "$..." : `$${totalRentPaid.toLocaleString()}`,
      icon: <Wallet className="h-4 w-4" />,
      description: t('yearToDate'),
      color: "text-green-500",
      bgColor: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
      borderColor: "border-green-100 dark:border-green-800/30 hover:border-green-200 dark:hover:border-green-700/40",
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {metrics.map((metric) => (
        <Card 
          key={metric.title}
          className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 bg-gradient-to-br ${metric.bgColor} ${metric.borderColor}`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center bg-white/80 dark:bg-gray-800/50 shadow-sm ${metric.color}`}>
                  {metric.icon}
                </div>
                <h3 className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors dark:text-gray-300">{metric.title}</h3>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xl font-bold transition-all duration-300 group-hover:translate-x-1 animate-fade-in dark:text-white">{metric.value}</div>
              <p className="text-xs text-muted-foreground mt-0.5 dark:text-gray-400">{metric.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
