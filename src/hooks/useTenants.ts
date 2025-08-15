import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { useTenantMessagesTranslations } from "@/hooks/useTenantMessagesTranslations";

export const useTenants = () => {
  const queryClient = useQueryClient();
  const { t } = useTenantMessagesTranslations();

  const { data: tenants, isLoading } = useQuery({
    queryKey: ["tenants"],
    queryFn: async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error("Vous devez être connecté pour voir les locataires");
      }

      const { data, error } = await supabase
        .from("tenants")
        .select(`
          *,
          properties (
            name,
            id,
            address
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
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error("Error fetching tenants:", error);
        toast({
          title: "Error fetching tenants",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
  });

  // Set up realtime subscription
  useEffect(() => {
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
          queryClient.invalidateQueries({ queryKey: ["tenants"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const addTenant = useMutation({
    mutationFn: async (newTenant: any) => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error("Vous devez être connecté pour ajouter un locataire");
      }

      const tenantData = {
        ...newTenant,
        user_id: user.id
      };

      const { data, error } = await supabase.from("tenants").insert(tenantData).select();
      
      if (error) {
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      toast({
        title: t('success'),
        description: t('tenantAdded'),
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error adding tenant",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateTenant = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const { data: updatedData, error } = await supabase
        .from("tenants")
        .update(data)
        .eq("id", id);
      if (error) throw error;
      return updatedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating tenant",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteTenant = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tenants").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      toast({
        title: "Success",
        description: "Tenant deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting tenant",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    tenants,
    isLoading,
    addTenant,
    updateTenant,
    deleteTenant,
  };
};
