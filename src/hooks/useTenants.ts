
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

      console.log("Raw Supabase response:", data);
      console.log("Tenants data fetched successfully:", data);
      if (data && data.length > 0) {
        console.log("=== DETAILED TENANT DATA DEBUG ===");
        data.forEach((tenant, index) => {
          console.log(`Tenant ${index + 1}:`, {
            id: tenant.id,
            name: tenant.name,
            property_id: tenant.property_id,
            properties: tenant.properties,
            properties_type: typeof tenant.properties,
            properties_isArray: Array.isArray(tenant.properties),
            properties_keys: tenant.properties ? Object.keys(tenant.properties) : 'null'
          });
        });
        console.log("=== END DEBUG ===");
      }
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
      
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error("User not authenticated:", userError);
        throw new Error("Vous devez être connecté pour ajouter un locataire");
      }

      // Add user_id to the tenant data
      const tenantData = {
        ...newTenant,
        user_id: user.id
      };

      console.log("Tenant data with user_id:", tenantData);

      const { data, error } = await supabase.from("tenants").insert(tenantData).select();
      
      if (error) {
        console.error("Database error:", error);
        throw error;
      }
      
      console.log("Tenant added successfully:", data);
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

  const updateTenant = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      console.log("Updating tenant:", id, data);
      const { data: updatedData, error } = await supabase
        .from("tenants")
        .update(data)
        .eq("id", id);
      if (error) throw error;
      return updatedData;
    },
    onSuccess: () => {
      console.log("Tenant updated successfully");
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
    onError: (error: Error) => {
      console.error("Error updating tenant:", error);
      toast({
        title: "Error updating tenant",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteTenant = useMutation({
    mutationFn: async (id: string) => {
      console.log("Deleting tenant:", id);
      const { error } = await supabase.from("tenants").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      console.log("Tenant deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      toast({
        title: "Success",
        description: "Tenant deleted successfully",
      });
    },
    onError: (error: Error) => {
      console.error("Error deleting tenant:", error);
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
