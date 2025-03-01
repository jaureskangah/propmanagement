
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
      const { data, error } = await supabase
        .from('tenant_communications')
        .select('*')
        .eq('tenant_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      
      setCommunications(data || []);
    } catch (error) {
      console.error('Error fetching communications:', error);
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
