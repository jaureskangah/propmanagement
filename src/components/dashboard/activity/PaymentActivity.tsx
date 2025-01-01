import { DollarSign } from "lucide-react";
import { ActivityItem } from "./ActivityItem";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const PaymentActivity = () => {
  const { data: payments } = useQuery({
    queryKey: ["recent_payments"],
    queryFn: async () => {
      console.log("Fetching recent payments...");
      const { data, error } = await supabase
        .from("tenant_payments")
        .select(`
          *,
          tenants (
            unit_number
          )
        `)
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      console.log("Recent payments data:", data);
      return data;
    },
  });

  return (
    <>
      {payments?.map((payment) => (
        <ActivityItem
          key={payment.id}
          icon={DollarSign}
          iconColor="text-emerald-600"
          iconBgColor="bg-emerald-100"
          title="Payment Received"
          description={`$${payment.amount.toLocaleString()} - Studio ${payment.tenants?.unit_number}`}
          date={payment.created_at}
        />
      ))}
    </>
  );
};