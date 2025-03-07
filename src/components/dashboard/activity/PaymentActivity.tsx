
import { DollarSign } from "lucide-react";
import { ActivityItem } from "./ActivityItem";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Badge } from "@/components/ui/badge";

interface PaymentActivityProps {
  payment: {
    id: string;
    amount: number;
    created_at: string;
    tenants: {
      unit_number: string;
    };
  };
}

export const PaymentActivity = ({ payment }: PaymentActivityProps) => {
  const { t } = useLocale();
  
  // Format details for hover card
  const details = {
    [t('paymentId')]: payment.id,
    [t('amount')]: `$${payment.amount.toLocaleString()}`,
    [t('unit')]: payment.tenants?.unit_number,
    [t('status')]: t('completed')
  };
  
  return (
    <div className="relative">
      <Badge 
        variant="success" 
        className="absolute -right-1 -top-1 z-10 shadow-sm"
      >
        {t('payment')}
      </Badge>
      <ActivityItem
        key={payment.id}
        icon={DollarSign}
        iconColor="text-white"
        iconBgColor="bg-emerald-500"
        title={t('paymentReceived')}
        description={`$${payment.amount.toLocaleString()} - ${t('unit')} ${payment.tenants?.unit_number}`}
        date={payment.created_at}
        details={details}
      />
    </div>
  );
};
