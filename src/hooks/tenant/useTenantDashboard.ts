
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useTenantData } from '@/hooks/tenant/dashboard/useTenantData';
import { useCommunicationsData } from '@/hooks/tenant/dashboard/useCommunicationsData';
import { useMaintenanceData } from '@/hooks/tenant/dashboard/useMaintenanceData';
import { usePaymentsAndDocuments } from '@/hooks/tenant/dashboard/usePaymentsAndDocuments';
import { useLeaseStatus } from '@/hooks/tenant/dashboard/useLeaseStatus';
import { useToast } from '@/hooks/use-toast';

export const useTenantDashboard = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { tenant, isLoading: isLoadingTenant, fetchTenantData } = useTenantData();
  const { communications, isLoading: isLoadingComms, fetchCommunications } = useCommunicationsData();
  const { maintenanceRequests, isLoading: isLoadingMaintenance, fetchMaintenanceRequests } = useMaintenanceData();
  const { payments, documents, isLoading: isLoadingPayments, fetchPaymentsAndDocuments } = usePaymentsAndDocuments();
  const leaseStatus = useLeaseStatus(tenant?.lease_end);
  const { toast } = useToast();

  // Utiliser des refs pour éviter les re-créations
  const isSecondaryDataLoading = useRef(false);
  const lastSecondaryDataLoad = useRef(0);

  console.log("=== OPTIMIZED TENANT DASHBOARD HOOK ===");
  console.log("tenant:", !!tenant, "ID:", tenant?.id);
  console.log("isLoadingTenant:", isLoadingTenant);
  console.log("isRefreshing:", isRefreshing);

  // Only consider essential loading (tenant data) for main loading state
  const isLoading = isLoadingTenant || isRefreshing;
  
  console.log("Final loading state:", isLoading);
  console.log("Can show dashboard:", !isLoading && !!tenant);

  // Fonction stable pour charger les données secondaires
  const loadSecondaryData = useCallback(async () => {
    if (!tenant?.id || isRefreshing || isSecondaryDataLoading.current) return;
    
    // Éviter les appels trop fréquents
    const now = Date.now();
    if (now - lastSecondaryDataLoad.current < 2000) {
      console.log("Secondary data load skipped - too frequent");
      return;
    }
    lastSecondaryDataLoad.current = now;
    
    console.log("=== LOADING SECONDARY DATA (OPTIMIZED) ===");
    console.log("Tenant ID available:", tenant.id);
    
    isSecondaryDataLoading.current = true;
    
    try {
      console.log("Loading secondary data with staggered approach...");
      
      // Load secondary data with error isolation and delays
      const promises = [
        fetchCommunications().catch(err => {
          console.error('Background communications fetch failed:', err);
          return null;
        }),
        new Promise(resolve => setTimeout(resolve, 200)).then(() => 
          fetchMaintenanceRequests().catch(err => {
            console.error('Background maintenance fetch failed:', err);
            return null;
          })
        ),
        new Promise(resolve => setTimeout(resolve, 400)).then(() =>
          fetchPaymentsAndDocuments().catch(err => {
            console.error('Background payments/documents fetch failed:', err);
            return null;
          })
        )
      ];
      
      await Promise.allSettled(promises);
      console.log("All secondary data loading completed (some may have failed)");
    } catch (error) {
      console.error('Error in secondary data loading:', error);
    } finally {
      isSecondaryDataLoading.current = false;
    }
  }, [tenant?.id, isRefreshing, fetchCommunications, fetchMaintenanceRequests, fetchPaymentsAndDocuments]);

  // Effect optimisé avec dépendances stables
  useEffect(() => {
    if (tenant?.id && !isRefreshing) {
      // Debounce secondary data loading plus agressivement
      const timer = setTimeout(() => {
        loadSecondaryData();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [tenant?.id, isRefreshing]); // Retirer loadSecondaryData des dépendances

  // Fonction de refresh stable
  const refreshDashboard = useCallback(async () => {
    console.log("=== REFRESHING DASHBOARD (OPTIMIZED) ===");
    setIsRefreshing(true);
    
    try {
      // First reload tenant data
      await fetchTenantData();
      
      // Then reload secondary data with longer delays
      await fetchCommunications();
      await new Promise(resolve => setTimeout(resolve, 300));
      await fetchMaintenanceRequests();
      await new Promise(resolve => setTimeout(resolve, 300));
      await fetchPaymentsAndDocuments();
      
      console.log("Dashboard refresh completed successfully");
      toast({
        title: "Dashboard actualisé",
        description: "Toutes les données ont été mises à jour avec succès.",
      });
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
      toast({
        title: "Erreur de rafraîchissement",
        description: "Impossible de rafraîchir le dashboard. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchTenantData, fetchCommunications, fetchMaintenanceRequests, fetchPaymentsAndDocuments, toast]);

  // Memoized return object to prevent unnecessary re-renders
  return useMemo(() => ({
    tenant,
    communications: communications || [],
    maintenanceRequests: maintenanceRequests || [],
    payments: payments || [],
    documents: documents || [],
    leaseStatus,
    isLoading,
    refreshDashboard
  }), [tenant, communications, maintenanceRequests, payments, documents, leaseStatus, isLoading, refreshDashboard]);
};
