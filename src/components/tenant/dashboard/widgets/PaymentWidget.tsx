
import { 
  DollarSign, 
  ArrowUpRight, 
  Calendar, 
  CheckCircle, 
  AlertCircle,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, isAfter, isBefore, startOfMonth, addMonths } from "date-fns";
import type { Payment } from "@/types/tenant";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface PaymentWidgetProps {
  rentAmount: number;
  payments: Payment[];
}

export const PaymentWidget = ({ rentAmount, payments }: PaymentWidgetProps) => {
  const { t } = useLocale();
  const navigate = useNavigate();
  
  // Get current month payment
  const currentMonth = startOfMonth(new Date());
  const nextMonth = addMonths(currentMonth, 1);
  
  const currentMonthPayment = payments.find(payment => {
    const paymentDate = new Date(payment.payment_date);
    return isAfter(paymentDate, currentMonth) && isBefore(paymentDate, nextMonth);
  });
  
  const isPaid = currentMonthPayment?.status === 'paid';
  const isPending = currentMonthPayment?.status === 'pending';
  const isOverdue = currentMonthPayment?.status === 'overdue';
  
  // Get last payment
  const lastPayment = payments[0];
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      whileHover={{ y: -5 }}
      className="rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 p-5"
    >
      <div className="flex items-center mb-4">
        <DollarSign className="h-5 w-5 mr-2 text-emerald-600" />
        <h3 className="font-semibold text-emerald-700">Payments</h3>
      </div>
      
      <div className="space-y-5">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white/70 rounded-lg p-4 shadow-sm"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-500">Current Month Rent</span>
            <span className="text-2xl font-bold text-emerald-700">${rentAmount}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">{t('status')}</span>
            <div>
              {isPaid && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" /> {t('paid')}
                </Badge>
              )}
              {isPending && (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  <Clock className="h-3 w-3 mr-1" /> {t('pending')}
                </Badge>
              )}
              {isOverdue && (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  <AlertCircle className="h-3 w-3 mr-1" /> {t('overdue')}
                </Badge>
              )}
              {!currentMonthPayment && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Calendar className="h-3 w-3 mr-1" /> Not Paid Yet
                </Badge>
              )}
            </div>
          </div>
        </motion.div>
        
        {lastPayment && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white/70 rounded-lg p-4 shadow-sm"
          >
            <span className="text-sm text-gray-500 block mb-3">Last Payment</span>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-gray-800">${lastPayment.amount}</span>
                <span className="text-xs text-gray-500 ml-2">
                  {format(new Date(lastPayment.payment_date), 'PP')}
                </span>
              </div>
              <Badge 
                variant="outline" 
                className={
                  lastPayment.status === 'paid' 
                    ? 'bg-green-50 text-green-700 border-green-200' 
                    : lastPayment.status === 'pending' 
                    ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                    : 'bg-red-50 text-red-700 border-red-200'
                }
              >
                {lastPayment.status}
              </Badge>
            </div>
          </motion.div>
        )}
        
        <Button 
          className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white"
          onClick={() => navigate('/tenant/payments')}
        >
          <span className="mr-1">{isPaid ? "View Payment History" : "Make Payment"}</span>
          <ArrowUpRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};
