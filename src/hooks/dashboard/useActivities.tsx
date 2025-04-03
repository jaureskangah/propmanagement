
import { useEffect } from "react";
import { 
  useTenantActivities, 
  usePaymentActivities, 
  useMaintenanceActivities 
} from "./activity/useActivityData";
import { useTransformedActivities } from "./activity/useActivityTransformers";
import { useActivityFiltering } from "./activity/useActivityFiltering";
import { useActivityGrouping } from "./activity/useActivityGrouping";

export type { Activity } from "./activityTypes";
export type { GroupedActivities } from "./activityTypes";

export function useActivities() {
  const { data: tenants = [], isLoading: isLoadingTenants } = useTenantActivities();
  const { data: payments = [], isLoading: isLoadingPayments } = usePaymentActivities();
  const { data: maintenance = [], isLoading: isLoadingMaintenance } = useMaintenanceActivities();

  // Debug the retrieved data
  useEffect(() => {
    console.log("Données récupérées:", {
      tenants: tenants.length,
      payments: payments.length,
      maintenance: maintenance.length
    });
  }, [tenants, payments, maintenance]);

  const allActivities = useTransformedActivities(tenants, payments, maintenance);
  
  const {
    limitedActivities,
    activityTypeFilter,
    setActivityFilter,
    hasMoreActivities,
    showMoreActivities
  } = useActivityFiltering(allActivities);

  const groupedActivities = useActivityGrouping(limitedActivities);

  const isLoading = isLoadingTenants || isLoadingPayments || isLoadingMaintenance;

  return {
    groupedActivities,
    isLoading,
    activityTypeFilter,
    setActivityTypeFilter: setActivityFilter,
    hasMoreActivities,
    showMoreActivities
  };
}
