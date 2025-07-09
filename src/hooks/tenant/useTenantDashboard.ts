
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

  // Use refs to prevent excessive re-renders
  const isSecondaryDataLoading = useRef(false);
  const lastSecondaryDataLoad = useRef(0);
  const retryCount = useRef(0);
  const maxRetries = 2;

  // Only consider essential loading (tenant data) for main loading state
  const isLoading = isLoadingTenant || isRefreshing;

  // Resilient function to load secondary data
  const loadSecondaryData = useCallback(async () => {
    if (!tenant?.id || isRefreshing || isSecondaryDataLoading.current) return;
    
    // Prevent too frequent calls
    const now = Date.now();
    if (now - lastSecondaryDataLoad.current < 3000) {
      console.log("Secondary data load skipped - too frequent");
      return;
    }
    lastSecondaryDataLoad.current = now;
    
    isSecondaryDataLoading.current = true;
    
    try {
      
      // Load secondary data with generous delays and error isolation
      const promises = [
        fetchCommunications().catch(() => null),
        new Promise(resolve => setTimeout(resolve, 500)).then(() => 
          fetchMaintenanceRequests().catch(() => null)
        ),
        new Promise(resolve => setTimeout(resolve, 800)).then(() =>
          fetchPaymentsAndDocuments().catch(() => null)
        )
      ];
      
      await Promise.allSettled(promises);
      retryCount.current = 0; // Reset on success
    } catch (error) {
      // Implement retry logic for critical failures
      if (retryCount.current < maxRetries) {
        retryCount.current++;
        setTimeout(() => {
          if (tenant?.id && !isRefreshing) {
            loadSecondaryData();
          }
        }, 5000 * retryCount.current); // Exponential backoff
      }
    } finally {
      isSecondaryDataLoading.current = false;
    }
  }, [tenant?.id, isRefreshing]); // Remove function dependencies to prevent recreation

  // Optimized effect with stable dependencies
  useEffect(() => {
    if (tenant?.id && !isRefreshing) {
      // More aggressive debouncing for tablet stability
      const timer = setTimeout(() => {
        loadSecondaryData();
      }, 1000); // Longer initial delay
      
      return () => clearTimeout(timer);
    }
  }, [tenant?.id, isRefreshing]); // Only essential dependencies

  // Resilient refresh function
  const refreshDashboard = useCallback(async () => {
    setIsRefreshing(true);
    
    try {
      // First reload tenant data with retry logic
      let tenantDataSuccess = false;
      for (let i = 0; i < 3; i++) {
        try {
          await fetchTenantData();
          tenantDataSuccess = true;
          break;
        } catch (error) {
          if (i < 2) {
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
          }
        }
      }

      if (!tenantDataSuccess) {
        throw new Error('Failed to refresh tenant data after 3 attempts');
      }
      
      // Then reload secondary data with longer delays and error tolerance
      const secondaryPromises = [
        fetchCommunications().catch(() => null),
        new Promise(resolve => setTimeout(resolve, 500)).then(() =>
          fetchMaintenanceRequests().catch(() => null)
        ),
        new Promise(resolve => setTimeout(resolve, 800)).then(() =>
          fetchPaymentsAndDocuments().catch(() => null)
        )
      ];
      
      await Promise.allSettled(secondaryPromises);
      
      toast({
        title: "Dashboard actualisé",
        description: "Toutes les données ont été mises à jour avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur de rafraîchissement",
        description: "Impossible de rafraîchir complètement le dashboard. Certaines données peuvent être manquantes.",
        variant: "destructive",
      });
      
      // Don't prevent dashboard from showing if refresh fails
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
