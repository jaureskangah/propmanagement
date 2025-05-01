
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useState, useCallback, useMemo, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type FetchOptions = {
  pageSize?: number;
  offset?: number;
  filters?: Record<string, any>;
  orderBy?: { column: string; ascending?: boolean };
  select?: string;
};

/**
 * Hook optimisé pour charger de grands ensembles de données avec pagination, filtrage et mise en cache
 */
export function useOptimizedQuery<T = any>(
  table: string,
  options: {
    queryKey?: string[];
    initialPageSize?: number;
    staleTime?: number;
    cacheTime?: number;
    filters?: Record<string, any>;
    orderBy?: { column: string; ascending?: boolean };
    select?: string;
    enabled?: boolean;
  } = {}
) {
  const {
    queryKey = [table],
    initialPageSize = 20,
    staleTime = 5 * 60 * 1000,
    cacheTime = 15 * 60 * 1000,
    filters = {},
    orderBy = { column: 'created_at', ascending: false },
    select = '*',
    enabled = true
  } = options;

  const [pageSize, setPageSize] = useState(initialPageSize);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchColumns, setSearchColumns] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState(filters);

  // Calcul de l'offset basé sur la page courante et la taille de la page
  const offset = useMemo(() => (currentPage - 1) * pageSize, [currentPage, pageSize]);

  // Fonction pour construire la requête Supabase avec tous les paramètres
  const buildQuery = useCallback((fetchOptions: FetchOptions = {}) => {
    const {
      pageSize: limit = pageSize,
      offset: start = offset,
      filters: queryFilters = activeFilters,
      orderBy: queryOrderBy = orderBy,
      select: querySelect = select
    } = fetchOptions;

    let query = supabase
      .from(table)
      .select(querySelect)
      .range(start, start + limit - 1);

    // Appliquer tous les filtres
    if (queryFilters) {
      Object.entries(queryFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            if (value.length > 0) {
              query = query.in(key, value);
            }
          } else if (typeof value === 'object' && value !== null) {
            // Gérer les opérateurs spéciaux comme gt, lt, etc.
            if (value.gt !== undefined) query = query.gt(key, value.gt);
            if (value.lt !== undefined) query = query.lt(key, value.lt);
            if (value.gte !== undefined) query = query.gte(key, value.gte);
            if (value.lte !== undefined) query = query.lte(key, value.lte);
            if (value.like !== undefined) query = query.like(key, value.like);
          } else {
            query = query.eq(key, value);
          }
        }
      });
    }

    // Appliquer la recherche textuelle sur les colonnes spécifiées
    if (searchQuery && searchColumns.length > 0) {
      const searchTerm = `%${searchQuery}%`;
      let searchFilter = searchColumns.map(column => `${column}.ilike.${searchTerm}`).join(',');
      query = query.or(searchFilter);
    }

    // Appliquer le tri
    if (queryOrderBy?.column) {
      query = query.order(queryOrderBy.column, {
        ascending: queryOrderBy.ascending ?? false
      });
    }

    return query;
  }, [table, pageSize, offset, activeFilters, orderBy, select, searchQuery, searchColumns]);

  // Requête principale pour récupérer les données paginées
  const { 
    data: paginatedData,
    error,
    isLoading,
    refetch,
    isFetching
  } = useQuery({
    queryKey: [...queryKey, { page: currentPage, pageSize, filters: activeFilters, search: searchQuery }],
    queryFn: async () => {
      console.log(`Fetching page ${currentPage} from ${table} with pageSize ${pageSize}`);
      
      // Récupérer les données paginées
      const query = buildQuery();
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Récupérer le nombre total de lignes pour la pagination
      const { count, error: countError } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
        
      if (countError) throw countError;
      
      return {
        data: data || [],
        totalCount: count || 0,
        pageCount: Math.ceil((count || 0) / pageSize)
      };
    },
    staleTime,
    gcTime: cacheTime,
    enabled: enabled,
    keepPreviousData: true, // Garder les données précédentes pendant le chargement pour une UX fluide
  });

  // Précharger la page suivante pour une meilleure expérience utilisateur
  useEffect(() => {
    if (!paginatedData || !enabled) return;
    
    // Ne précharger que s'il y a une page suivante
    if (currentPage < paginatedData.pageCount) {
      const nextPage = currentPage + 1;
      const nextOffset = pageSize * nextPage;
      
      // Construire et exécuter la requête pour la page suivante
      const query = buildQuery({
        offset: nextOffset,
        pageSize
      });
      
      // Déclencher la requête mais ne pas attendre le résultat
      query.then(() => {
        console.log(`Preloaded page ${nextPage} from ${table}`);
      }).catch(err => {
        console.error(`Failed to preload page ${nextPage}:`, err);
      });
    }
  }, [paginatedData, currentPage, pageSize, enabled, buildQuery, table]);

  // Fonction pour récupérer tous les résultats (avec gestion de grands volumes)
  const fetchAll = useCallback(async () => {
    try {
      console.log(`Fetching all data from ${table} in batches`);
      
      // Première requête pour obtenir le compte total
      const { count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
        
      if (!count) return [];
      
      // Calculer le nombre de lots nécessaires (max 1000 par lot)
      const batchSize = 1000;
      const batchCount = Math.ceil(count / batchSize);
      
      // Récupérer toutes les données par lots
      const allData: T[] = [];
      for (let i = 0; i < batchCount; i++) {
        const start = i * batchSize;
        const { data, error } = await buildQuery({
          offset: start,
          pageSize: batchSize
        });
        
        if (error) throw error;
        if (data) allData.push(...data);
        
        console.log(`Fetched batch ${i+1}/${batchCount} (${data?.length} records)`);
      }
      
      return allData;
    } catch (err) {
      console.error("Error fetching all data:", err);
      throw err;
    }
  }, [table, buildQuery]);

  // Interface de pagination
  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, page));
  }, []);

  const nextPage = useCallback(() => {
    if (paginatedData && currentPage < paginatedData.pageCount) {
      setCurrentPage(p => p + 1);
    }
  }, [currentPage, paginatedData]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(p => p - 1);
    }
  }, [currentPage]);

  // Configuration du chargement en scroll infini
  const {
    data: infiniteData,
    fetchNextPage: fetchNextInfinite,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: [...queryKey, 'infinite', { filters: activeFilters, search: searchQuery }],
    queryFn: async ({ pageParam = 0 }) => {
      const query = buildQuery({
        offset: pageParam,
        pageSize
      });
      
      const { data, error } = await query;
      if (error) throw error;
      
      return { data: data || [], nextOffset: pageParam + pageSize };
    },
    getNextPageParam: (lastPage, pages) => {
      // Si la dernière page contient moins d'éléments que pageSize, c'est qu'il n'y a plus de pages suivantes
      if (lastPage.data.length < pageSize) return undefined;
      return lastPage.nextOffset;
    },
    staleTime,
    gcTime: cacheTime,
    enabled: false, // Désactivé par défaut, activer sur demande
  });

  // API complète avec options de pagination standard et infinite scroll
  return {
    // Données et état
    data: paginatedData?.data || [],
    totalCount: paginatedData?.totalCount || 0,
    pageCount: paginatedData?.pageCount || 0,
    isLoading,
    isFetching,
    error,
    
    // Configuration
    currentPage,
    pageSize,
    setPageSize,
    
    // Pagination
    goToPage,
    nextPage,
    prevPage,
    hasNextPage: paginatedData ? currentPage < paginatedData.pageCount : false,
    hasPrevPage: currentPage > 1,
    
    // Recherche
    searchQuery,
    setSearchQuery,
    searchColumns,
    setSearchColumns,
    
    // Filtres
    filters: activeFilters,
    setFilters: setActiveFilters,
    
    // Rechargement
    refetch,
    
    // Récupération de toutes les données
    fetchAll,
    
    // Support scroll infini
    infiniteData: infiniteData?.pages.flatMap(page => page.data) || [],
    fetchNextInfinitePage: fetchNextInfinite,
    hasNextInfinitePage: hasNextPage,
    isFetchingNextInfinitePage: isFetchingNextPage,
  };
}
