import { DollarSign } from "lucide-react";
import { ActivityItem } from "./ActivityItem";

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
  return (
    <ActivityItem
      key={payment.id}
      icon={DollarSign}
      iconColor="text-emerald-600"
      iconBgColor="bg-emerald-100"
      title="Payment Received"
      description={`$${payment.amount.toLocaleString()} - Studio ${payment.tenants?.unit_number}`}
      date={payment.created_at}
    />
  );
};