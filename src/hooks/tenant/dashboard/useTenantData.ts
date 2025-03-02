
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface TenantData {
  id: string;
  name: string;
  email: string;
  unit_number: string;
  lease_start: string;
  lease_end: string;
  rent_amount: number;
  properties?: {
    name: string;
  };
  firstName?: string;
  lastName?: string;
  fullName?: string;
}

export const useTenantData = () => {
  const [tenant, setTenant] = useState<TenantData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchTenantData();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchTenantData = async () => {
    try {
      setIsLoading(true);
      
      // First check if we can get profile data
      const { data: profileData } = await supabase
        .from('profiles')
        .select('first_name, last_name, full_name')
        .eq('id', user?.id)
        .maybeSingle();
        
      // Then get tenant data
      const { data: tenant, error } = await supabase
        .from('tenants')
        .select(`
          id, 
          name, 
          email, 
          unit_number, 
          lease_start, 
          lease_end, 
          rent_amount,
          properties (name)
        `)
        .eq('tenant_profile_id', user?.id)
        .maybeSingle();

      if (error) throw error;

      if (tenant) {
        // Use profile name if available, otherwise fall back to tenant name
        const displayName = profileData?.full_name || tenant.name || user?.user_metadata?.full_name;
        const firstName = profileData?.first_name || user?.user_metadata?.first_name;
        const lastName = profileData?.last_name || user?.user_metadata?.last_name;
        
        // Handle the properties object properly
        setTenant({
          ...tenant,
          name: displayName, // Use the display name from profile if available
          firstName: firstName,
          lastName: lastName,
          fullName: displayName,
          properties: tenant.properties as unknown as { name: string }
        });
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching tenant data:', error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Could not load tenant data",
        variant: "destructive",
      });
    }
  };

  return {
    tenant,
    isLoading,
    fetchTenantData
  };
};
