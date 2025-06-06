
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Communication } from "@/types/tenant";
import { useAuth } from "@/components/AuthProvider";

export const useCommunicationsData = () => {
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  
  const fetchCommunications = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      console.log("Fetching communications for user:", user.id);
      
      // First get the tenant ID
      const { data: tenantData, error: tenantError } = await supabase
        .from('tenants')
        .select('id')
        .eq('tenant_profile_id', user.id)
        .maybeSingle();

      if (tenantError) {
        console.error('Error fetching tenant data:', tenantError);
        setCommunications([]);
        setIsLoading(false);
        return;
      }

      const tenantId = tenantData?.id;
      if (!tenantId) {
        console.log('No tenant found for user:', user.id);
        setCommunications([]);
        setIsLoading(false);
        return;
      }
      
      console.log("Found tenant ID:", tenantId);
      
      const { data, error } = await supabase
        .from('tenant_communications')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      
      console.log("Communications fetched:", data);
      setCommunications(data || []);
    } catch (error) {
      console.error('Error fetching communications:', error);
      setCommunications([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunications();
  }, [user]);

  return {
    communications,
    isLoading,
    fetchCommunications
  };
};
