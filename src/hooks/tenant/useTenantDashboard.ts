
import { useState, useEffect } from "react";
import { useLeaseStatus } from "./dashboard/useLeaseStatus";
import { useCommunicationsData } from "./dashboard/useCommunicationsData";
import { useMaintenanceData } from "./dashboard/useMaintenanceData";
import { usePaymentsAndDocuments } from "./dashboard/usePaymentsAndDocuments";
import { useTenantData } from "./dashboard/useTenantData";
import { useToast } from "@/hooks/use-toast";
import { useDashboardPreferences } from "@/components/dashboard/hooks/useDashboardPreferences";

export const useTenantDashboard = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { tenant, isLoading: isTenantLoading, fetchTenantData } = useTenantData();
  const { communications, isLoading: isCommLoading, fetchCommunications } = useCommunicationsData();
  const { maintenanceRequests, isLoading: isMaintenanceLoading, fetchMaintenanceRequests } = useMaintenanceData();
  const { payments, documents, isLoading: isPaymentsDocsLoading, fetchPaymentsAndDocuments } = usePaymentsAndDocuments();
  const leaseStatus = useLeaseStatus(tenant?.lease_end);
  const { toast } = useToast();
  const { preferences, updatePreferences } = useDashboardPreferences();

  const isLoading = isTenantLoading || isCommLoading || isMaintenanceLoading || isPaymentsDocsLoading || isRefreshing;

  const refreshDashboard = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        fetchTenantData(),
        fetchCommunications(),
        fetchMaintenanceRequests(),
        fetchPaymentsAndDocuments()
      ]);
      
      toast({
        title: "Dashboard refreshed",
        description: "The latest data has been loaded",
      });
    } catch (error) {
      console.error("Error refreshing dashboard:", error);
      toast({
        title: "Refresh failed",
        description: "Could not refresh dashboard data",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return {
    tenant,
    communications,
    maintenanceRequests,
    payments,
    documents,
    leaseStatus,
    isLoading,
    refreshDashboard
  };
};
