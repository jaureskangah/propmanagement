import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import type { Tenant } from "@/types/tenant";

export interface TenantData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  lease_start: string;
  lease_end: string;
  rent_amount: number | null;
  unit_number: string;
  properties?: {
    name: string;
    address: string;
  };
  // Other properties can be added as needed
}

export const convertToTenant = (tenantData: TenantData): Tenant => {
  return {
    id: tenantData.id,
    name: tenantData.name,
    email: tenantData.email,
    phone: tenantData.phone,
    property_id: null,  // Default values for required Tenant fields
    properties: tenantData.properties ? { name: tenantData.properties.name } : undefined,
    unit_number: tenantData.unit_number,
    lease_start: tenantData.lease_start,
    lease_end: tenantData.lease_end,
    rent_amount: tenantData.rent_amount || 0,
    user_id: "",  // Default value
    created_at: "",  // Default value
    updated_at: "",  // Default value
    tenant_profile_id: null,  // Default value
    documents: [],  // Default empty array
    paymentHistory: [],  // Default empty array
    maintenanceRequests: [],  // Default empty array
    communications: []  // Default empty array
  };
};

export const useTenantData = () => {
  const { user } = useAuth();
  const [tenant, setTenant] = useState<TenantData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTenant = async () => {
    if (!user?.id) {
      setIsLoading(false);
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch tenant data from profiles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone')
        .eq('id', user.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      if (!profileData) {
        setTenant(null);
        setIsLoading(false);
        return null;
      }

      // Fetch tenant-specific data if it exists
      const { data: tenantData, error: tenantError } = await supabase
        .from('tenant_profiles')
        .select(`
          id, 
          lease_start, 
          lease_end, 
          rent_amount, 
          unit_number,
          property_id,
          properties:property_id (name, address)
        `)
        .eq('user_id', user.id)
        .maybeSingle();

      if (tenantError && tenantError.code !== 'PGRST116') {
        throw tenantError;
      }

      // Combine profile and tenant data
      const combinedTenantData: TenantData = {
        id: profileData.id,
        name: profileData.full_name,
        email: profileData.email,
        phone: profileData.phone,
        lease_start: tenantData?.lease_start || '',
        lease_end: tenantData?.lease_end || '',
        rent_amount: tenantData?.rent_amount || null,
        unit_number: tenantData?.unit_number || '',
        properties: tenantData?.properties || undefined
      };

      setTenant(combinedTenantData);
      return combinedTenantData;
    } catch (err: any) {
      console.error('Error fetching tenant data:', err);
      setError(err.message || 'Failed to load tenant data');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTenant();
  }, [user?.id]);

  return {
    tenant,
    isLoading,
    error,
    refreshTenant: fetchTenant
  };
};
