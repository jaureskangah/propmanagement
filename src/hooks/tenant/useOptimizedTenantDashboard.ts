import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useTenantDashboard } from './useTenantDashboard';
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications';
import { useEnhancedRealtime } from '@/hooks/notifications/useEnhancedRealtime';
import { usePersistentCache } from './usePersistentCache';

/**
 * Hook optimisé pour le dashboard locataire avec :
 * - Gestion d'état optimisée pour réduire les re-rendus
 * - Notifications temps réel intégrées
 * - Cache intelligent des données
 * - Auto-refresh intelligent
 */
export const useOptimizedTenantDashboard = () => {
  const [lastDataUpdate, setLastDataUpdate] = useState(Date.now());
  const cacheRef = useRef(new Map());
  const refreshTimerRef = useRef<NodeJS.Timeout>();
  
  // Cache persistant pour les données fréquemment consultées
  const tenantCache = usePersistentCache('tenant_data', null, 15); // 15 minutes
  const communicationsCache = usePersistentCache('communications', [], 5); // 5 minutes
  const maintenanceCache = usePersistentCache('maintenance', [], 10); // 10 minutes
  
  // Hook principal du dashboard
  const dashboardData = useTenantDashboard();
  
  // Notifications temps réel
  const realtimeNotifications = useRealtimeNotifications();
  
  // Enhanced realtime pour les échéances et maintenance
  const { checkPaymentDeadlines } = useEnhancedRealtime();

  // Cache intelligent hybride (mémoire + persistant)
  const getCachedData = useCallback((key: string, data: any) => {
    // Cache mémoire pour éviter les re-rendus immédiats
    const memoryCache = cacheRef.current.get(key);
    const now = Date.now();
    
    if (memoryCache && now - memoryCache.timestamp < 30000) {
      return memoryCache.data;
    }
    
    // Cache persistant pour les données importantes
    let persistentData = null;
    switch (key) {
      case 'tenant':
        persistentData = tenantCache.getCachedValue('current_tenant');
        break;
      case 'communications':
        persistentData = communicationsCache.getCachedValue('recent_communications');
        break;
      case 'maintenanceRequests':
        persistentData = maintenanceCache.getCachedValue('active_requests');
        break;
    }
    
    // Si on a des données fraîches, les utiliser
    if (data && JSON.stringify(data) !== JSON.stringify(persistentData)) {
      // Mettre à jour les caches
      cacheRef.current.set(key, { data, timestamp: now });
      
      switch (key) {
        case 'tenant':
          tenantCache.setCachedValue('current_tenant', data);
          break;
        case 'communications':
          communicationsCache.setCachedValue('recent_communications', data);
          break;
        case 'maintenanceRequests':
          maintenanceCache.setCachedValue('active_requests', data);
          break;
      }
      
      return data;
    }
    
    // Sinon, retourner les données du cache persistant ou les nouvelles données
    return persistentData || data;
  }, [tenantCache, communicationsCache, maintenanceCache]);

  // Auto-refresh intelligent (uniquement si nécessaire)
  const setupAutoRefresh = useCallback(() => {
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
    }
    
    // Refresh automatique des données critiques toutes les 2 minutes
    refreshTimerRef.current = setInterval(() => {
      const now = Date.now();
      
      // Ne refresh que si les données sont "anciennes" (plus de 2 minutes)
      if (now - lastDataUpdate > 120000) {
        console.log('Auto-refresh triggered for critical data');
        
        // Refresh silencieux (sans loading)
        realtimeNotifications.refreshUnreadMessages?.();
        realtimeNotifications.refreshMaintenanceRequests?.();
        checkPaymentDeadlines?.();
        
        setLastDataUpdate(now);
      }
    }, 120000); // 2 minutes
    
    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, [lastDataUpdate, realtimeNotifications, checkPaymentDeadlines]);

  // Fonction de refresh optimisée
  const optimizedRefresh = useCallback(async () => {
    console.log('Optimized refresh triggered');
    
    // Marquer comme mis à jour
    setLastDataUpdate(Date.now());
    
    // Vider le cache pour forcer le rechargement
    cacheRef.current.clear();
    
    // Appeler le refresh du dashboard principal
    await dashboardData.refreshDashboard();
    
    // Refresh des notifications
    await Promise.all([
      realtimeNotifications.refreshUnreadMessages?.(),
      realtimeNotifications.refreshMaintenanceRequests?.()
    ]);
  }, [dashboardData.refreshDashboard, realtimeNotifications]);

  // Nettoyage lors de la déconnexion ou démontage du composant
  useEffect(() => {
    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
      cacheRef.current.clear();
    };
  }, []);

  // Données avec cache intelligent pour éviter les re-rendus
  const optimizedData = useMemo(() => {
    return {
      // Données principales avec cache
      tenant: getCachedData('tenant', dashboardData.tenant),
      communications: getCachedData('communications', dashboardData.communications),
      maintenanceRequests: getCachedData('maintenanceRequests', dashboardData.maintenanceRequests),
      payments: getCachedData('payments', dashboardData.payments),
      documents: getCachedData('documents', dashboardData.documents),
      leaseStatus: getCachedData('leaseStatus', dashboardData.leaseStatus),
      
      // États de chargement
      isLoading: dashboardData.isLoading,
      
      // Notifications temps réel
      notifications: {
        unreadMessages: realtimeNotifications.unreadMessages,
        totalCount: realtimeNotifications.totalNotificationCount,
        showUnreadDialog: realtimeNotifications.showUnreadDialog,
        setShowUnreadDialog: realtimeNotifications.setShowUnreadDialog,
        markAllAsRead: realtimeNotifications.markAllMessagesAsRead
      },
      
      // Fonctions optimisées
      refreshDashboard: optimizedRefresh,
      setupAutoRefresh
    };
  }, [
    dashboardData.tenant,
    dashboardData.communications,
    dashboardData.maintenanceRequests,
    dashboardData.payments,
    dashboardData.documents,
    dashboardData.leaseStatus,
    dashboardData.isLoading,
    realtimeNotifications.unreadMessages,
    realtimeNotifications.totalNotificationCount,
    realtimeNotifications.showUnreadDialog,
    realtimeNotifications.setShowUnreadDialog,
    realtimeNotifications.markAllMessagesAsRead,
    optimizedRefresh,
    setupAutoRefresh,
    getCachedData
  ]);

  return optimizedData;
};