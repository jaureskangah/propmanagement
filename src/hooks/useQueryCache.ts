
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface QueryCacheOptions {
  staleTime?: number;
  cacheTime?: number;
  enabled?: boolean;
  onSuccess?: (data: any) => void;
}

export const useQueryCache = <T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options: QueryCacheOptions = {}
) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey,
    queryFn,
    staleTime: options.staleTime || 5 * 60 * 1000, // 5 minutes par défaut
    gcTime: options.cacheTime || 10 * 60 * 1000, // 10 minutes par défaut
    enabled: options.enabled,
  });

  // Fonction pour invalider le cache
  const invalidateCache = () => {
    queryClient.invalidateQueries({ queryKey });
  };

  // Fonction pour forcer un refetch
  const refetch = () => {
    return query.refetch();
  };

  return {
    ...query,
    invalidateCache,
    refetch,
  };
};
