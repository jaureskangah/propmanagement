
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
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden bg-gradient-to-br from-sky-50 to-cyan-50 border border-sky-100 dark:from-sky-900/20 dark:to-cyan-900/20 dark:border-sky-800/30 p-5"
    >
      <div className="flex items-center mb-4">
        <BarChart3 className="h-5 w-5 mr-2 text-sky-600 dark:text-sky-400" />
        <h3 className="font-semibold text-sky-700 dark:text-sky-300">{t('paymentHistory')}</h3>
      </div>
      
      {chartData.length > 0 ? (
        <div className="bg-white/80 dark:bg-gray-800/60 rounded-lg p-4 shadow-sm">
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 5 }}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--foreground)', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--foreground)', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--background)',
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    color: 'var(--foreground)'
                  }}
                  itemStyle={{ padding: '5px 0' }}
                  formatter={(value) => [`$${value}`, t('amount')]}
                />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
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
          
          <div className="flex justify-center mt-4 space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-xs text-gray-600 dark:text-gray-300">{t('paid')}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
              <span className="text-xs text-gray-600 dark:text-gray-300">{t('pending')}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-xs text-gray-600 dark:text-gray-300">{t('overdue')}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white/60 dark:bg-gray-800/60 rounded-lg">
          <BarChart3 className="h-10 w-10 text-sky-300 dark:text-sky-500/50 mx-auto mb-2 opacity-50" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('noPaymentHistory')}
          </p>
        </div>
      )}
    </motion.div>
  );
};
