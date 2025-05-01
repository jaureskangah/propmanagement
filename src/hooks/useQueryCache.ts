
import { useQuery, useQueryClient, QueryKey, UseQueryOptions } from "@tanstack/react-query";
import { useState, useCallback, useRef, useEffect } from "react";

/**
 * Hook personnalisé pour mettre en cache les requêtes fréquentes
 * avec des options avancées pour l'optimisation des performances
 */
export function useQueryCache<TData, TError = unknown>(
  queryKey: QueryKey,
  queryFn: () => Promise<TData>,
  options: {
    staleTime?: number;
    cacheTime?: number;
    batchSize?: number;
    initialData?: TData | (() => TData);
    onSuccess?: (data: TData) => void;
    enabled?: boolean;
  } = {}
) {
  const queryClient = useQueryClient();
  const {
    staleTime = 5 * 60 * 1000, // 5 minutes par défaut
    cacheTime = 30 * 60 * 1000, // 30 minutes par défaut
    batchSize,
    initialData,
    onSuccess,
    enabled = true
  } = options;

  // Utilisé pour suivre les appels en cours pour éviter les requêtes dupliquées
  const pendingRequestRef = useRef<Promise<TData> | null>(null);

  const fetchWithDeduplication = useCallback(async () => {
    // Si une requête est en cours avec la même clé, réutiliser cette promesse
    if (pendingRequestRef.current) {
      return pendingRequestRef.current;
    }

    // Sinon, démarrer une nouvelle requête
    const promise = queryFn().finally(() => {
      // Réinitialiser la référence une fois la requête terminée
      pendingRequestRef.current = null;
    });

    pendingRequestRef.current = promise;
    return promise;
  }, [queryFn]);

  // Utiliser useQuery de Tanstack Query avec nos optimisations
  const result = useQuery({
    queryKey,
    queryFn: fetchWithDeduplication,
    staleTime, // Temps avant qu'une requête soit considérée comme périmée
    gcTime: cacheTime, // Temps de conservation en cache (remplace cacheTime depuis v5)
    initialData,
    enabled,
    meta: {
      onSuccess: onSuccess as any
    }
  });

  // Préchargement des données liées si nécessaire
  const prefetchRelatedData = useCallback(
    (relatedQueryKey: QueryKey, relatedQueryFn: () => Promise<any>) => {
      queryClient.prefetchQuery({
        queryKey: relatedQueryKey,
        queryFn: relatedQueryFn,
        staleTime
      });
    },
    [queryClient, staleTime]
  );

  // Méthode pour forcer le rafraîchissement des données
  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [queryClient, queryKey]);

  return {
    ...result,
    prefetchRelatedData,
    refresh,
    queryClient
  };
}

/**
 * Hook pour charger des données paginées avec gestion de cache efficace
 */
export function usePaginatedQueryCache<TData>(
  baseQueryKey: QueryKey,
  fetchItems: (page: number, pageSize: number) => Promise<{ data: TData[]; totalCount: number }>,
  options: {
    pageSize?: number;
    initialPage?: number;
    staleTime?: number;
    cacheTime?: number;
    enabled?: boolean;
  } = {}
) {
  const {
    pageSize = 10,
    initialPage = 1,
    staleTime = 5 * 60 * 1000, // 5 minutes par défaut
    cacheTime = 30 * 60 * 1000,
    enabled = true
  } = options;

  const [page, setPage] = useState(initialPage);
  const queryClient = useQueryClient();

  // Clé unique pour cette requête paginée
  const queryKey = [...baseQueryKey, { page, pageSize }];

  // Précharger la page suivante pour une navigation plus fluide
  useEffect(() => {
    const nextPage = page + 1;
    const nextPageKey = [...baseQueryKey, { page: nextPage, pageSize }];
    
    queryClient.prefetchQuery({
      queryKey: nextPageKey,
      queryFn: () => fetchItems(nextPage, pageSize),
      staleTime
    });
  }, [page, pageSize, queryClient, baseQueryKey, fetchItems, staleTime]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: () => fetchItems(page, pageSize),
    staleTime,
    gcTime: cacheTime,
    enabled
  });

  // Fonctions utilitaires pour la pagination
  const goToNextPage = useCallback(() => {
    setPage(prevPage => prevPage + 1);
  }, []);

  const goToPreviousPage = useCallback(() => {
    setPage(prevPage => (prevPage > 1 ? prevPage - 1 : 1));
  }, []);

  const goToPage = useCallback((newPage: number) => {
    setPage(Math.max(1, newPage));
  }, []);

  return {
    data,
    isLoading,
    error,
    page,
    pageSize,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    refetch,
    totalPages: data ? Math.ceil(data.totalCount / pageSize) : 0
  };
}

/**
 * Hook pour mettre en cache des données localement avec expiration
 */
export function useLocalCache<T>(key: string, initialData?: T) {
  const [data, setData] = useState<T | undefined>(() => {
    // Essayer de récupérer du localStorage au chargement
    try {
      const item = window.localStorage.getItem(`cache_${key}`);
      if (!item) return initialData;
      
      const { value, expiry } = JSON.parse(item);
      
      // Vérifier si les données ont expiré
      if (expiry && expiry < Date.now()) {
        window.localStorage.removeItem(`cache_${key}`);
        return initialData;
      }
      
      return value;
    } catch {
      return initialData;
    }
  });

  // Enregistrer des données dans le cache avec une durée d'expiration
  const setWithExpiry = useCallback((value: T, ttl: number = 3600000) => {
    const item = {
      value,
      expiry: ttl > 0 ? Date.now() + ttl : null
    };
    
    try {
      window.localStorage.setItem(`cache_${key}`, JSON.stringify(item));
      setData(value);
    } catch (error) {
      console.error("Error saving to cache:", error);
    }
  }, [key]);

  // Effacer les données du cache
  const clearCache = useCallback(() => {
    try {
      window.localStorage.removeItem(`cache_${key}`);
      setData(undefined);
    } catch (error) {
      console.error("Error clearing cache:", error);
    }
  }, [key]);

  return { data, setData: setWithExpiry, clearCache };
}
