import { useState, useCallback, useEffect } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiryTime: number;
}

/**
 * Hook pour cache intelligent avec persistance localStorage
 * - Cache les données fréquemment consultées
 * - Expiration automatique
 * - Persistence entre les sessions
 */
export const usePersistentCache = <T>(
  cacheKey: string,
  defaultValue: T,
  expiryMinutes: number = 30
) => {
  const [cache, setCache] = useState<Map<string, CacheEntry<T>>>(new Map());

  // Charger le cache depuis localStorage au démarrage
  useEffect(() => {
    try {
      const storedCache = localStorage.getItem(`tenant_cache_${cacheKey}`);
      if (storedCache) {
        const parsedCache = JSON.parse(storedCache);
        const now = Date.now();
        
        // Filtrer les entrées expirées
        const validEntries = new Map();
        Object.entries(parsedCache).forEach(([key, entry]: [string, any]) => {
          if (entry.timestamp && entry.expiryTime && now < entry.expiryTime) {
            validEntries.set(key, entry);
          }
        });
        
        setCache(validEntries);
      }
    } catch (error) {
      console.warn('Erreur lors du chargement du cache:', error);
    }
  }, [cacheKey]);

  // Sauvegarder le cache dans localStorage
  const saveToStorage = useCallback((cacheMap: Map<string, CacheEntry<T>>) => {
    try {
      const cacheObject = Object.fromEntries(cacheMap);
      localStorage.setItem(`tenant_cache_${cacheKey}`, JSON.stringify(cacheObject));
    } catch (error) {
      console.warn('Erreur lors de la sauvegarde du cache:', error);
    }
  }, [cacheKey]);

  // Obtenir une valeur du cache
  const getCachedValue = useCallback((key: string): T | null => {
    const entry = cache.get(key);
    const now = Date.now();
    
    if (entry && now < entry.expiryTime) {
      return entry.data;
    }
    
    // Supprimer l'entrée expirée
    if (entry) {
      const newCache = new Map(cache);
      newCache.delete(key);
      setCache(newCache);
      saveToStorage(newCache);
    }
    
    return null;
  }, [cache, saveToStorage]);

  // Mettre en cache une valeur
  const setCachedValue = useCallback((key: string, value: T) => {
    const now = Date.now();
    const expiryTime = now + (expiryMinutes * 60 * 1000);
    
    const newEntry: CacheEntry<T> = {
      data: value,
      timestamp: now,
      expiryTime
    };
    
    const newCache = new Map(cache);
    newCache.set(key, newEntry);
    setCache(newCache);
    saveToStorage(newCache);
  }, [cache, expiryMinutes, saveToStorage]);

  // Supprimer une entrée du cache
  const removeCachedValue = useCallback((key: string) => {
    const newCache = new Map(cache);
    newCache.delete(key);
    setCache(newCache);
    saveToStorage(newCache);
  }, [cache, saveToStorage]);

  // Vider tout le cache
  const clearCache = useCallback(() => {
    setCache(new Map());
    try {
      localStorage.removeItem(`tenant_cache_${cacheKey}`);
    } catch (error) {
      console.warn('Erreur lors de la suppression du cache:', error);
    }
  }, [cacheKey]);

  // Obtenir ou définir une valeur avec fonction de récupération
  const getOrSet = useCallback(async (
    key: string,
    fetchFunction: () => Promise<T>
  ): Promise<T> => {
    // Essayer d'abord le cache
    const cachedValue = getCachedValue(key);
    if (cachedValue !== null) {
      return cachedValue;
    }
    
    // Sinon, récupérer la valeur et la mettre en cache
    try {
      const freshValue = await fetchFunction();
      setCachedValue(key, freshValue);
      return freshValue;
    } catch (error) {
      // En cas d'erreur, retourner la valeur par défaut
      console.warn('Erreur lors de la récupération des données:', error);
      return defaultValue;
    }
  }, [getCachedValue, setCachedValue, defaultValue]);

  // Obtenir les statistiques du cache
  const getCacheStats = useCallback(() => {
    const now = Date.now();
    const entries = Array.from(cache.entries());
    const validEntries = entries.filter(([, entry]) => now < entry.expiryTime);
    const expiredEntries = entries.filter(([, entry]) => now >= entry.expiryTime);
    
    return {
      totalEntries: entries.length,
      validEntries: validEntries.length,
      expiredEntries: expiredEntries.length,
      hitRate: validEntries.length / Math.max(entries.length, 1)
    };
  }, [cache]);

  return {
    getCachedValue,
    setCachedValue,
    removeCachedValue,
    clearCache,
    getOrSet,
    getCacheStats,
    cacheSize: cache.size
  };
};