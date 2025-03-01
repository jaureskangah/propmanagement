
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Communication } from "@/types/tenant";

export const useCommunicationsData = (tenantId: string | null) => {
  const [communications, setCommunications] = useState<Communication[]>([]);
  
  useEffect(() => {
    if (tenantId) {
      fetchCommunications(tenantId);
    }
  }, [tenantId]);

  const fetchCommunications = async (tenantId: string) => {
    try {
      const { data, error } = await supabase
        .from('tenant_communications')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      
      setCommunications(data || []);
    } catch (error) {
      console.error('Error fetching communications:', error);
    }
  };

  return {
    communications,
    fetchCommunications
  };
};
