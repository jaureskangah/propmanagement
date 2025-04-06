
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";

export interface TenantData {
  id: string;
  name: string;
  email: string;
  phone: string;
  lease_start: string;
  lease_end: string;
  rent_amount: number | null;
  unit_number: string;
  properties?: {
    name: string;
    address: string;
  };
}

export function useTenantData() {
  const { user } = useAuth();
  const [tenant, setTenant] = useState<TenantData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTenantData = useCallback(async () => {
    if (!user) {
      setTenant(null);
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Query tenants table with join to properties
      const { data, error } = await supabase
        .from('tenants')
        .select(`
          id,
          name,
          email,
          phone,
          lease_start,
          lease_end,
          rent_amount,
          unit_number,
          properties (
            name,
            address
          )
        `)
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      
      setTenant(data as TenantData);
    } catch (err) {
      console.error('Error fetching tenant data:', err);
      setError(err as Error);
      // For development purposes, set a mock tenant so dynamic fields work
      if (import.meta.env.DEV) {
        setTenant({
          id: 'dev-tenant',
          name: 'Development Tenant',
          email: 'dev@example.com',
          phone: '123-456-7890',
          lease_start: '2023-01-01',
          lease_end: '2023-12-31',
          rent_amount: 1200,
          unit_number: 'A101',
          properties: {
            name: 'Development Property',
            address: '123 Test St, Dev City'
          }
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTenantData();
  }, [fetchTenantData]);

  return {
    tenant,
    isLoading,
    error,
    refreshTenant: fetchTenantData
  };
}
