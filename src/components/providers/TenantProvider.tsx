
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import type { Tenant } from '@/types/tenant';

interface TenantContextProps {
  tenant: Tenant | null;
  isLoading: boolean;
  error: Error | null;
  fetchTenant: () => Promise<void>;
}

const TenantContext = createContext<TenantContextProps | undefined>(undefined);

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
};

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchTenant = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch tenant profile based on the user's ID
      const { data, error: fetchError } = await supabase
        .from('tenants')
        .select(`
          *,
          properties:property_id (
            name
          ),
          documents:tenant_documents (
            id, name, file_url, created_at, document_type, category
          ),
          maintenanceRequests:maintenance_requests (
            id, issue, status, created_at, priority, description, updated_at, deadline, photos, tenant_feedback, tenant_rating
          ),
          communications (
            id, type, subject, content, created_at, status, category, attachments, parent_id, is_from_tenant, resolved_at
          ),
          paymentHistory:payments (
            id, amount, status, payment_date, created_at, description
          )
        `)
        .eq('tenant_profile_id', user.id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      if (data) {
        // Handle properties data which could be an object or an array
        let propertyName = '';
        if (data.properties) {
          // If properties is an object with a name property
          if (typeof data.properties === 'object' && data.properties !== null && 'name' in data.properties) {
            propertyName = (data.properties as { name: string }).name;
          } 
          // If properties is an array and has items
          else if (Array.isArray(data.properties) && data.properties.length > 0) {
            const firstProperty = data.properties[0] as { name?: string } | undefined;
            propertyName = firstProperty?.name || '';
          }
        }

        const tenantWithPropertyName: Tenant = {
          ...data,
          properties: { name: propertyName }
        };

        setTenant(tenantWithPropertyName);
      } else {
        setTenant(null);
      }
    } catch (err) {
      console.error("Error fetching tenant data:", err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTenant();
    } else {
      setTenant(null);
      setIsLoading(false);
    }
  }, [user]);

  return (
    <TenantContext.Provider value={{ tenant, isLoading, error, fetchTenant }}>
      {children}
    </TenantContext.Provider>
  );
};
