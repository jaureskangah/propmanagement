
import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Tenant } from "@/types/tenant";

export const useTenantData = (userId: string | undefined, toast: any) => {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTenantData = useCallback(async () => {
    if (!userId) {
      console.log("useTenantData: No user ID provided");
      setIsLoading(false);
      return null;
    }
    
    try {
      console.log("Fetching tenant data for user:", userId);
      setIsLoading(true);
      const { data: tenantData, error: tenantError } = await supabase
        .from('tenants')
        .select(`
          *,
          properties(name)
        `)
        .eq('tenant_profile_id', userId)
        .maybeSingle();

      if (tenantError) {
        console.error('Error fetching tenant data:', tenantError);
        throw tenantError;
      }
      
      console.log("Tenant data result:", tenantData);
      setTenant(tenantData);
      return tenantData;
    } catch (error) {
      console.error('Error fetching tenant data:', error);
      toast({
        title: "Non lié",
        description: "Votre compte n'est pas lié à un profil locataire",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [userId, toast]);

  return {
    tenant,
    isLoading,
    fetchTenantData
  };
};
