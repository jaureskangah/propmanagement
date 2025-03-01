
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Calendar } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Payment } from "@/types/tenant";
import { format, parseISO, subMonths } from "date-fns";

interface PaymentHistoryChartProps {
  payments: Payment[];
}

export const PaymentHistoryChart = ({ payments }: PaymentHistoryChartProps) => {
  const { t } = useLocale();
  
  // Prepare data for the last 6 months
  const prepareChartData = () => {
    const now = new Date();
    const monthsData = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(now, 5 - i);
      const month = format(date, 'MMM');
      const year = format(date, 'yyyy');
      return {
        month,
        date: `${month} ${year}`,
        amount: 0
      };
    });
    
    // Add payment data
    payments.forEach(payment => {
      const paymentDate = new Date(payment.payment_date);
      const monthIndex = monthsData.findIndex(m => 
        format(paymentDate, 'MMM') === m.month && 
        format(paymentDate, 'yyyy') === format(paymentDate, 'yyyy')
      );
      
      if (monthIndex !== -1) {
        monthsData[monthIndex].amount += Number(payment.amount);
      }
    });
    
    return monthsData;
  };
  
  const chartData = prepareChartData();
  
  return (
    <Card className="shadow-sm transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <LineChart className="h-5 w-5 text-primary" />
          {t('paymentHistory')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 5,
                right: 5,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="#8884d8" 
                fill="#8884d8" 
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
