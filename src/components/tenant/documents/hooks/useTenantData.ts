
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
          properties:property_id(name)
        `)
        .eq('tenant_profile_id', userId)
        .maybeSingle();

      if (tenantError) {
        console.error('Error fetching tenant data:', tenantError);
        throw tenantError;
      }
      
      console.log("Tenant data result:", tenantData);
      
      // Ensure properties has the correct format
      if (tenantData) {
        // Handle properties data correctly
        let formattedProperties;
        
        if (Array.isArray(tenantData.properties)) {
          // If it's an array, take the first element if it exists
          formattedProperties = tenantData.properties.length > 0 && tenantData.properties[0]
            ? { name: tenantData.properties[0].name || "" }
            : { name: "" };
        } else if (tenantData.properties && typeof tenantData.properties === 'object') {
          // If it's already an object, use it directly
          formattedProperties = { name: tenantData.properties.name || "" };
        } else {
          // Fallback to empty object with name=""
          formattedProperties = { name: "" };
        }
        
        const formattedTenant = {
          ...tenantData,
          properties: formattedProperties
        };
        
        setTenant(formattedTenant);
        return formattedTenant;
      }
      
      return null;
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
