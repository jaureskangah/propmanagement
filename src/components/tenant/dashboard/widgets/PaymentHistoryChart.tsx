
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { BarChart3 } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { Payment } from "@/types/tenant";
import { motion } from "framer-motion";

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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.7 }}
      whileHover={{ y: -5 }}
      className="rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden bg-gradient-to-br from-sky-50 to-cyan-50 border border-sky-100 p-4 col-span-full"
    >
      <div className="flex items-center mb-3">
        <BarChart3 className="h-4 w-4 mr-1.5 text-sky-600" />
        <h3 className="font-semibold text-sm text-sky-700">{t('paymentHistory')}</h3>
      </div>
      
      {chartData.length > 0 ? (
        <div className="bg-white/80 rounded-lg p-3 shadow-sm">
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 15, right: 0, left: 0, bottom: 5 }}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 10 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 10 }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    fontSize: '11px',
                    padding: '6px 10px'
                  }}
                  itemStyle={{ padding: '3px 0' }}
                  formatter={(value) => [`$${value}`, t('amount')]}
                />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]} barSize={18}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={getBarColor(entry.status)} 
                      fillOpacity={0.8}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex justify-center mt-3 space-x-3">
            <div className="flex items-center">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full mr-1.5"></div>
              <span className="text-xs text-gray-600">{t('paid')}</span>
            </div>
            <div className="flex items-center">
              <div className="w-2.5 h-2.5 bg-amber-500 rounded-full mr-1.5"></div>
              <span className="text-xs text-gray-600">{t('pending')}</span>
            </div>
            <div className="flex items-center">
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full mr-1.5"></div>
              <span className="text-xs text-gray-600">{t('overdue')}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white/60 rounded-lg">
          <BarChart3 className="h-8 w-8 text-sky-300 mx-auto mb-2 opacity-50" />
          <p className="text-xs text-gray-500">
            {t('noPaymentHistory')}
          </p>
        </div>
      )}
    </motion.div>
  );
};
