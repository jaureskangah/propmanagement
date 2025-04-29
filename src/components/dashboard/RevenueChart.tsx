
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
import { Loader2 } from "lucide-react";
import { useRevenueData } from "./hooks/useRevenueData";
import { RevenueChartTooltip } from "./revenue/RevenueChartTooltip";
import { processMonthlyData } from "./revenue/revenueUtils";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useEffect } from "react";

export const RevenueChart = () => {
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

  // Si nous avons plusieurs propriétés, agréger toutes les données
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

  // Si nous avons plusieurs propriétés, agréger toutes les dépenses
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

  const aggregatedPayments = aggregateRevenue(payments, properties);
  const aggregatedExpenses = aggregateExpenses(expenses, properties);
  
  const monthlyData = processMonthlyData(aggregatedExpenses, aggregatedPayments);
  console.log("RevenueChart processed monthly data:", {
    dataPoints: monthlyData.length,
    firstMonth: monthlyData[0]?.month,
    lastMonth: monthlyData[monthlyData.length - 1]?.month
  });

  // Updated colors to match the finance page
  const revenueColor = "#0EA5E9"; // Blue color for revenue
  const expensesColor = "#ea384c";  // Red color for expenses

  return (
    <Card className="font-sans group transition-all duration-300 hover:shadow-lg animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-base font-medium bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          {t('revenue')} & {t('expenses')}
        </CardTitle>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 transition-transform duration-300 hover:scale-105">
            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: revenueColor }} />
            <span className="text-xs text-muted-foreground">{t('revenue')}</span>
          </div>
          <div className="flex items-center gap-1.5 transition-transform duration-300 hover:scale-105">
            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: expensesColor }} />
            <span className="text-xs text-muted-foreground">{t('expenses')}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[270px] transition-transform duration-500 group-hover:scale-[1.02]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={revenueColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={revenueColor} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={expensesColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={expensesColor} stopOpacity={0} />
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
                fontSize={10}
                tickLine={false}
                axisLine={false}
                dy={5}
              />
              <YAxis
                stroke="#888888"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                dx={-5}
              />
              <Tooltip content={RevenueChartTooltip} />
              <Area
                type="monotone"
                dataKey="amount"
                stroke={revenueColor}
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                animationDuration={1000}
                animationBegin={0}
                activeDot={{
                  r: 4,
                  stroke: revenueColor,
                  strokeWidth: 1.5,
                  fill: 'white',
                  className: 'animate-pulse'
                }}
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke={expensesColor}
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#colorExpenses)"
                animationDuration={1000}
                animationBegin={500}
                activeDot={{
                  r: 4,
                  stroke: expensesColor,
                  strokeWidth: 1.5,
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
