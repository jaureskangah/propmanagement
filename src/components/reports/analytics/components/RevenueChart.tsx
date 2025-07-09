import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { useLocale } from "@/components/providers/LocaleProvider";
import { format, startOfMonth, eachMonthOfInterval, subMonths } from "date-fns";
import { fr } from "date-fns/locale";

interface RevenueChartProps {
  payments: any[];
}

export const RevenueChart = ({ payments }: RevenueChartProps) => {
  const { t, language } = useLocale();
  const locale = language === 'fr' ? fr : undefined;

  // Generate last 12 months data
  const endDate = new Date();
  const startDate = startOfMonth(subMonths(endDate, 11));
  const months = eachMonthOfInterval({ start: startDate, end: endDate });

  const revenueData = months.map(month => {
    const monthStart = startOfMonth(month);
    const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    
    const monthlyRevenue = payments
      .filter(payment => {
        const paymentDate = new Date(payment.payment_date);
        return paymentDate >= monthStart && paymentDate <= monthEnd;
      })
      .reduce((sum, payment) => sum + (payment.amount || 0), 0);

    return {
      month: format(month, 'MMM yyyy', { locale }),
      revenue: monthlyRevenue,
      displayRevenue: `€${monthlyRevenue.toLocaleString()}`
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          {t('revenueEvolution', { fallback: 'Évolution des Revenus' })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/20" />
              <XAxis 
                dataKey="month" 
                className="text-xs"
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                className="text-xs"
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={(value) => `€${value.toLocaleString()}`}
              />
              <Tooltip 
                formatter={(value: number) => [`€${value.toLocaleString()}`, t('revenue', { fallback: 'Revenus' })]}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};