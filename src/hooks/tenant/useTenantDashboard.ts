
import { useState, useEffect, useCallback, useMemo } from 'react';
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

  console.log("=== OPTIMIZED TENANT DASHBOARD HOOK ===");
  console.log("tenant:", !!tenant, "ID:", tenant?.id);
  console.log("isLoadingTenant:", isLoadingTenant);
  console.log("isRefreshing:", isRefreshing);

  // Only consider essential loading (tenant data) for main loading state
  const isLoading = isLoadingTenant || isRefreshing;
  
  console.log("Final loading state:", isLoading);
  console.log("Can show dashboard:", !isLoading && !!tenant);

  // Memoized secondary data loading function to prevent recreation
  const loadSecondaryData = useCallback(async () => {
    if (!tenant?.id || isRefreshing) return;
    
    console.log("=== LOADING SECONDARY DATA (OPTIMIZED) ===");
    console.log("Tenant ID available:", tenant.id);
    
    try {
      console.log("Loading secondary data with staggered approach...");
      
      // Load secondary data with error isolation
      const promises = [
        fetchCommunications().catch(err => {
          console.error('Background communications fetch failed:', err);
          return null;
        }),
        fetchMaintenanceRequests().catch(err => {
          console.error('Background maintenance fetch failed:', err);
          return null;
        }),
        fetchPaymentsAndDocuments().catch(err => {
          console.error('Background payments/documents fetch failed:', err);
          return null;
        })
      ];
      
      // Stagger the requests to reduce server load
      await Promise.allSettled(promises);
      console.log("Secondary data loading completed");
    } catch (error) {
      console.error('Error in secondary data loading:', error);
      // Don't show error toast for background operations
    }
  }, [tenant?.id, isRefreshing, fetchCommunications, fetchMaintenanceRequests, fetchPaymentsAndDocuments]);

  // Optimized effect with proper dependencies
  useEffect(() => {
    if (tenant?.id && !isRefreshing) {
      // Debounce secondary data loading
      const timer = setTimeout(() => {
        loadSecondaryData();
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [tenant?.id, loadSecondaryData]);

  // Memoized refresh function to prevent recreation
  const refreshDashboard = useCallback(async () => {
    console.log("=== REFRESHING DASHBOARD (OPTIMIZED) ===");
    setIsRefreshing(true);
    
    try {
      // First reload tenant data
      await fetchTenantData();
      
      // Then reload secondary data in sequence to prevent resource exhaustion
      await fetchCommunications();
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
      await fetchMaintenanceRequests();
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
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
