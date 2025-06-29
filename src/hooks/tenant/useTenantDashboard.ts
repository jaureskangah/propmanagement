
import { useState, useEffect } from 'react';
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

  console.log("=== USTENANTDASHBOARD HOOK ===");
  console.log("tenant:", tenant);
  console.log("isLoadingTenant:", isLoadingTenant);
  console.log("isLoadingComms:", isLoadingComms);
  console.log("isLoadingMaintenance:", isLoadingMaintenance);
  console.log("isLoadingPayments:", isLoadingPayments);
  console.log("isRefreshing:", isRefreshing);

  // Simplify loading state calculation
  const isLoading = isLoadingTenant || isRefreshing;
  
  console.log("Final loading state:", isLoading);

  // Fetch additional data when tenant is available
  useEffect(() => {
    console.log("=== USETENANTDASHBOARD EFFECT ===");
    console.log("Tenant available:", !!tenant);
    console.log("Tenant data:", tenant);

    if (tenant && !isRefreshing) {
      console.log("Tenant found, loading additional data...");
      // Load additional data in background without affecting main loading state
      const loadAdditionalData = async () => {
        try {
          console.log("Starting to load communications, maintenance, and payments...");
          await Promise.all([
            fetchCommunications(),
            fetchMaintenanceRequests(),
            fetchPaymentsAndDocuments()
          ]);
          console.log("All additional data loaded successfully");
        } catch (error) {
          console.error('Error fetching additional dashboard data:', error);
          // Don't show error toast for background data loading
        }
      };
      
      loadAdditionalData();
    }
  }, [tenant?.id]); // Only depend on tenant ID to avoid unnecessary re-runs

  // Refresh all data
  const refreshDashboard = async () => {
    console.log("=== REFRESHING DASHBOARD ===");
    setIsRefreshing(true);
    try {
      await fetchTenantData();
      await Promise.all([
        fetchCommunications(),
        fetchMaintenanceRequests(),
        fetchPaymentsAndDocuments()
      ]);
      console.log("Dashboard refreshed successfully");
      toast({
        title: "Dashboard refreshed",
        description: "All data has been successfully updated.",
      });
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
      toast({
        title: "Refresh failed",
        description: "Could not refresh dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return {
    tenant,
    communications: communications || [],
    maintenanceRequests: maintenanceRequests || [],
    payments: payments || [],
    documents: documents || [],
    leaseStatus,
    isLoading,
    refreshDashboard
  };
};
