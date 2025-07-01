
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";

export const useOptimizedFinancialData = (selectedPropertyId: string | null) => {
  const { user } = useAuth();

  const { data: properties = [], isLoading: isLoadingProperties } = useQuery({
    queryKey: ['properties', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('properties')
        .select('id, name, address')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  return {
    properties,
    isLoadingProperties,
  };
};
