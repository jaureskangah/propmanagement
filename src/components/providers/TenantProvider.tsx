
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { Tenant } from "@/types/tenant";

interface TenantContextType {
  tenant: Tenant | null;
  isLoading: boolean;
  refetchTenant: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType>({
  tenant: null,
  isLoading: true,
  refetchTenant: async () => {}
});

export const useTenantContext = () => useContext(TenantContext);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchTenantData = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Récupérer les données du locataire associé à cet utilisateur
      const { data, error } = await supabase
        .from('tenants')
        .select(`
          id,
          name,
          email,
          property_id,
          properties:property_id (name),
          unit_number,
          phone,
          lease_start,
          lease_end,
          rent_amount,
          security_deposit,
          payment_due_day,
          emergency_contact,
          emergency_phone,
          notes,
          tenant_profile_id
        `)
        .eq('tenant_profile_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching tenant data:', error);
        throw error;
      }
      
      if (data) {
        // Transform the data to match our Tenant type
        const tenantData: Tenant = {
          id: data.id,
          name: data.name,
          email: data.email,
          property_id: data.property_id,
          properties: {
            name: data.properties?.name || ""
          }, // Fix here: ensure properties is an object with a name property
          unit_number: data.unit_number,
          phone: data.phone,
          lease_start: data.lease_start,
          lease_end: data.lease_end,
          rent_amount: data.rent_amount,
          security_deposit: data.security_deposit,
          payment_due_day: data.payment_due_day,
          emergency_contact: data.emergency_contact,
          emergency_phone: data.emergency_phone,
          notes: data.notes,
          tenant_profile_id: data.tenant_profile_id
        };
        
        setTenant(tenantData);
      } else {
        setTenant(null);
      }
    } catch (error) {
      console.error("Error in TenantProvider:", error);
      setTenant(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTenantData();
  }, [user]);

  return (
    <TenantContext.Provider value={{ tenant, isLoading, refetchTenant: fetchTenantData }}>
      {children}
    </TenantContext.Provider>
  );
};
