import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";

export const useTenants = () => {
  const queryClient = useQueryClient();

  const { data: tenants, isLoading } = useQuery({
    queryKey: ["tenants"],
    queryFn: async () => {
      console.log("Fetching tenants data...");
      const { data, error } = await supabase
        .from("tenants")
        .select(`
          *,
          properties (
            name
          ),
          tenant_documents (
            id,
            name,
            created_at
          ),
          tenant_payments (
            id,
            amount,
            status,
            payment_date,
            created_at
          ),
          maintenance_requests (
            id,
            issue,
            status,
            created_at
          ),
          tenant_communications (
            id,
            type,
            subject,
            created_at
          )
        `);

      if (error) {
        console.error("Error fetching tenants:", error);
        toast({
          title: "Error fetching tenants",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      console.log("Tenants data fetched successfully:", data);
      return data;
    },
  });

  // Set up realtime subscription
  useEffect(() => {
    console.log("Setting up realtime subscription for tenants...");
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'tenants'
        },
        (payload) => {
          console.log("New tenant inserted:", payload);
          // Invalidate and refetch
          queryClient.invalidateQueries({ queryKey: ["tenants"] });
        }
      )
      .subscribe();

    return () => {
      console.log("Cleaning up realtime subscription...");
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const addTenant = useMutation({
    mutationFn: async (newTenant: any) => {
      console.log("Adding new tenant:", newTenant);
      const { data, error } = await supabase.from("tenants").insert(newTenant);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      console.log("Tenant added successfully");
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      toast({
        title: "Success",
        description: "Tenant added successfully",
      });
    },
    onError: (error: Error) => {
      console.error("Error adding tenant:", error);
      toast({
        title: "Error adding tenant",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    tenants,
    isLoading,
    addTenant,
  };
};