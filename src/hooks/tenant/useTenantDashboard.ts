
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
  const { payments, documents, isLoading: isLoadingPayments, fetchPayments, fetchDocuments } = usePaymentsAndDocuments();
  const leaseStatus = useLeaseStatus(tenant?.lease_end);
  const { toast } = useToast();

  // Fetch all data when tenant is available
  useEffect(() => {
    if (tenant) {
      // Refresh all data
      const loadData = async () => {
        try {
          await Promise.all([
            fetchCommunications(),
            fetchMaintenanceRequests(),
            fetchPayments(),
            fetchDocuments()
          ]);
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      loadData();
    } else {
      setIsLoading(isLoadingTenant);
    }
  }, [tenant]);

  // Refresh all data
  const refreshDashboard = async () => {
    setIsLoading(true);
    try {
      await fetchTenantData();
      await Promise.all([
        fetchCommunications(),
        fetchMaintenanceRequests(),
        fetchPayments(),
        fetchDocuments()
      ]);
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

  return {
    tenant,
    communications,
    maintenanceRequests,
    payments,
    documents,
    leaseStatus,
    isLoading: isLoading || isLoadingTenant || isLoadingComms || isLoadingMaintenance || isLoadingPayments,
    refreshDashboard
  };
};
