
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useOptimizedFinancialData = (propertyId: string | null) => {
  const { data: properties, isLoading: isLoadingProperties } = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
  });

  return {
    properties,
    isLoadingProperties,
  };
};
