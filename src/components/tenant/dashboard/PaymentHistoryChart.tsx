
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { BarChart3 } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { Payment } from "@/types/tenant";

interface PaymentHistoryChartProps {
  payments: Payment[];
}

export const PaymentHistoryChart = ({ payments }: PaymentHistoryChartProps) => {
  const { t, locale } = useLocale();
  
  // Process the payment data for the chart
  const getChartData = () => {
    // Get last 6 months of payments
    const last6Months = payments
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6)
      .reverse();
    
    return last6Months.map(payment => {
      const date = new Date(payment.date);
      const month = date.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { month: 'short' });
      
      return {
        name: month,
        amount: payment.amount,
        status: payment.status
      };
    });
  };
  
  const chartData = getChartData();
  
  // Generate colors based on payment status
  const getBarColor = (status: string) => {
    switch (status) {
      case 'paid':
        return '#10b981'; // green-500
      case 'pending':
        return '#f59e0b'; // amber-500
      case 'overdue':
        return '#ef4444'; // red-500
      default:
        return '#6b7280'; // gray-500
    }
  };
  
  return (
    <Card className="shadow-sm transition-all hover:shadow-md col-span-1 md:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          {t('paymentHistory')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.status)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-16">
            <BarChart3 className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-sm text-muted-foreground">
              {t('noPaymentHistory')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
