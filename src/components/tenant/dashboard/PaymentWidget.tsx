
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="shadow-sm transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          {t('payments')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-muted-foreground">{t('currentMonthRent')}</span>
            <span className="text-xl font-bold">${rentAmount}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{t('status')}</span>
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
                  <Calendar className="h-3 w-3 mr-1" /> {t('notPaidYet')}
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        {lastPayment && (
          <div className="pt-2 border-t">
            <span className="text-sm text-muted-foreground block mb-1">{t('lastPayment')}</span>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">${lastPayment.amount}</span>
                <span className="text-xs text-muted-foreground ml-2">
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
          </div>
        )}
        
        <Button 
          className="w-full mt-2"
          onClick={() => navigate('/tenant/payments')}
        >
          {isPaid ? t('viewPaymentHistory') : t('makePayment')}
          <ArrowUpRight className="h-4 w-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
};
