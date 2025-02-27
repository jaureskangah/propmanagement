
import { DollarSign } from "lucide-react";
import { ActivityItem } from "./ActivityItem";
import { useLocale } from "@/components/providers/LocaleProvider";

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
  
  return (
    <ActivityItem
      key={payment.id}
      icon={DollarSign}
      iconColor="text-emerald-600"
      iconBgColor="bg-emerald-100"
      title={t('paymentReceived')}
      description={`$${payment.amount.toLocaleString()} - ${t('unit')} ${payment.tenants?.unit_number}`}
      date={payment.created_at}
    />
  );
};
