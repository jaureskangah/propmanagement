
import { useQueryCache } from "@/hooks/useQueryCache";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import type { Tenant } from "@/types/tenant";

export const useTenantData = () => {
  const { toast } = useToast();

  // Helper function to get property name safely
  const getPropertyName = (tenant: any): string => {
    if (!tenant.properties) {
      return '';
    }
    
    console.log("getPropertyName - properties data:", tenant.properties);
    console.log("getPropertyName - properties type:", typeof tenant.properties);
    
    if (typeof tenant.properties === 'object' && !Array.isArray(tenant.properties) && tenant.properties !== null) {
      if ('name' in tenant.properties && typeof tenant.properties.name === 'string') {
        console.log("getPropertyName - Found name in object:", tenant.properties.name);
        return tenant.properties.name;
      }
    }
    
    if (Array.isArray(tenant.properties) && tenant.properties.length > 0) {
      const firstProperty = tenant.properties[0];
      if (typeof firstProperty === 'object' && firstProperty !== null && 'name' in firstProperty) {
        console.log("getPropertyName - Found name in array:", firstProperty.name);
        return firstProperty.name;
      }
    }
    
    return '';
  };

  const { data: tenants, isLoading, refetch, invalidateCache } = useQueryCache<any[]>(
    ["tenants"],
    async () => {
      console.log("Fetching tenants data with cache optimization...");
      const { data, error } = await supabase
        .from("tenants")
        .select(`
          *,
          properties:property_id (
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

      console.log("Tenants data fetched successfully with cache:", data?.length || 0);
      console.log("Sample tenant properties structure:", data && data.length > 0 ? JSON.stringify(data[0].properties) : "No tenants");
      return data || [];
    },
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      onSuccess: (data) => {
        console.log(`Loaded ${data?.length || 0} tenants from cache or fresh fetch`);
      }
    }
  );

  const mapTenantData = (tenant: any): Tenant => ({
    ...tenant,
    documents: tenant.tenant_documents || [],
    paymentHistory: tenant.tenant_payments || [],
    maintenanceRequests: tenant.maintenance_requests || [],
    communications: tenant.tenant_communications || [],
  });

  return {
    tenants,
    isLoading,
    refetch,
    invalidateCache,
    getPropertyName,
    mapTenantData,
  };
};
