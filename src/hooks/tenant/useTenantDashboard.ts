
import { useState, useEffect } from 'react';
import { useTenantData } from '@/hooks/tenant/dashboard/useTenantData';
import { useCommunicationsData } from '@/hooks/tenant/dashboard/useCommunicationsData';
import { useMaintenanceData } from '@/hooks/tenant/dashboard/useMaintenanceData';
import { usePaymentsAndDocuments } from '@/hooks/tenant/dashboard/usePaymentsAndDocuments';
import { useLeaseStatus } from '@/hooks/tenant/dashboard/useLeaseStatus';
import { useToast } from '@/hooks/use-toast';

export const useTenantDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
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
  console.log("Overall isLoading:", isLoading);

  // Fetch all data when tenant is available
  useEffect(() => {
    console.log("=== USETENANTDASHBOARD EFFECT ===");
    console.log("Tenant available:", !!tenant);
    console.log("Tenant data:", tenant);

    if (tenant) {
      console.log("Tenant found, loading additional data...");
      // Refresh all data
      const loadData = async () => {
        try {
          console.log("Starting to load communications, maintenance, and payments...");
          await Promise.all([
            fetchCommunications(),
            fetchMaintenanceRequests(),
            fetchPaymentsAndDocuments()
          ]);
          console.log("All data loaded successfully");
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        } finally {
          console.log("Setting loading to false");
          setIsLoading(false);
        }
      };
      
      loadData();
    } else {
      console.log("No tenant, setting loading state based on tenant loading:", isLoadingTenant);
      setIsLoading(isLoadingTenant);
    }
  }, [tenant]);

  // Refresh all data
  const refreshDashboard = async () => {
    console.log("=== REFRESHING DASHBOARD ===");
    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  const finalIsLoading = isLoading || isLoadingTenant || isLoadingComms || isLoadingMaintenance || isLoadingPayments;
  console.log("Final loading state:", finalIsLoading);

  return {
    tenant,
    communications,
    maintenanceRequests,
    payments,
    documents,
    leaseStatus,
    isLoading: finalIsLoading,
    refreshDashboard
  };
};
