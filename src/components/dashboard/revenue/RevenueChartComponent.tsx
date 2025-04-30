
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer } from "recharts";
import { Loader2 } from "lucide-react";
import { useRevenueData } from "../hooks/useRevenueData";
import { processMonthlyData } from "./revenueUtils";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useEffect } from "react";
import { RevenueChartLegend } from "./RevenueChartLegend";
import { RevenueAreaChart } from "./RevenueAreaChart";

export const RevenueChartComponent = () => {
  const { t } = useLocale();
  const { expenses, payments, properties, isLoading } = useRevenueData();

  useEffect(() => {
    console.log("RevenueChart data state:", {
      hasExpenses: !!expenses?.length,
      expensesCount: expenses?.length,
      hasPayments: !!payments?.length,
      paymentsCount: payments?.length,
      propertiesCount: properties?.length,
      isLoading
    });

    return () => {
      console.log("RevenueChart unmounting");
    };
  }, [expenses, payments, properties, isLoading]);

  if (isLoading) {
    console.log("RevenueChart is loading");
    return (
      <Card className="animate-pulse">
        <CardContent className="flex items-center justify-center h-[350px]">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  const aggregatedPayments = aggregateRevenue(payments, properties);
  const aggregatedExpenses = aggregateExpenses(expenses, properties);
  
  const monthlyData = processMonthlyData(aggregatedExpenses, aggregatedPayments);
  console.log("RevenueChart processed monthly data:", {
    dataPoints: monthlyData.length,
    firstMonth: monthlyData[0]?.month,
    lastMonth: monthlyData[monthlyData.length - 1]?.month,
    monthlyData
  });

  return (
    <Card className="font-sans group transition-all duration-300 hover:shadow-lg animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-base font-medium bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          {t('revenue')} & {t('expenses')}
        </CardTitle>
        <RevenueChartLegend />
      </CardHeader>
      <CardContent>
        <div className="h-[270px] transition-transform duration-500 group-hover:scale-[1.02]">
          <ResponsiveContainer width="100%" height="100%">
            <RevenueAreaChart monthlyData={monthlyData} />
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

// Revenue aggregation function
const aggregateRevenue = (payments = [], properties = []) => {
  // Traiter uniquement les paiements dont le statut est "paid"
  const paidPayments = payments.filter(payment => payment.status === "paid");
  console.log("Paid payments count:", paidPayments.length);
  
  // Si nous avons une seule propriété ou aucune, pas besoin d'agréger
  if (properties.length <= 1) {
    return paidPayments;
  }
  
  // Sinon, agréger les paiements par mois
  const aggregatedByMonth = paidPayments.reduce((acc, payment) => {
    const date = new Date(payment.payment_date);
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
    
    if (!acc[monthKey]) {
      acc[monthKey] = {
        payment_date: new Date(date.getFullYear(), date.getMonth(), 15).toISOString(),
        amount: 0,
        status: "paid"
      };
    }
    
    acc[monthKey].amount += Number(payment.amount);
    return acc;
  }, {});
  
  return Object.values(aggregatedByMonth);
};

// Expenses aggregation function
const aggregateExpenses = (expenses = [], properties = []) => {
  console.log("Expenses count:", expenses.length);
  
  // Si nous avons une seule propriété ou aucune, pas besoin d'agréger
  if (properties.length <= 1) {
    return expenses;
  }
  
  // Sinon, agréger les dépenses par mois
  const aggregatedByMonth = expenses.reduce((acc, expense) => {
    const date = new Date(expense.date);
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
    
    if (!acc[monthKey]) {
      acc[monthKey] = {
        date: new Date(date.getFullYear(), date.getMonth(), 15).toISOString(),
        amount: 0,
      };
    }
    
    // Prendre en compte soit le montant dépense, soit le coût d'intervention
    const expenseAmount = expense.amount || expense.cost || 0;
    acc[monthKey].amount += Number(expenseAmount);
    return acc;
  }, {});
  
  return Object.values(aggregatedByMonth);
};
