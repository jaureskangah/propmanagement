
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useRevenueData = () => {
  const { data: expenses, isLoading: isLoadingExpenses } = useQuery({
    queryKey: ["maintenance_expenses"],
    queryFn: async () => {
      console.log("Fetching maintenance expenses...");
      const { data, error } = await supabase
        .from("maintenance_expenses")
        .select("amount, date");
      if (error) throw error;
      console.log("Maintenance expenses data:", data);
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: payments, isLoading: isLoadingPayments } = useQuery({
    queryKey: ["tenant_payments"],
    queryFn: async () => {
      console.log("Fetching tenant payments...");
      const { data, error } = await supabase
        .from("tenant_payments")
        .select("amount, payment_date");
      if (error) throw error;
      console.log("Tenant payments data:", data);
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    expenses,
    payments,
    isLoading: isLoadingExpenses || isLoadingPayments
  };
};
