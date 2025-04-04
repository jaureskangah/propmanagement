
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
  
  // Log the transformed activities to help debugging
  useEffect(() => {
    console.log("Activités transformées:", {
      count: allActivities.length,
      types: [...new Set(allActivities.map(a => a.type))],
      firstFew: allActivities.slice(0, 3)
    });
  }, [allActivities]);
  
  const {
    limitedActivities,
    activityTypeFilter,
    setActivityFilter,
    hasMoreActivities,
    showMoreActivities
  } = useActivityFiltering(allActivities);

  // Force update groupedActivities when filter changes
  const groupedActivities = useActivityGrouping(limitedActivities);
  
  // Debug the final grouped activities
  useEffect(() => {
    console.log("Activités groupées après filtrage:", {
      filtre: activityTypeFilter,
      groupes: Object.keys(groupedActivities),
      nombreTotal: Object.values(groupedActivities).flat().length
    });
  }, [groupedActivities, activityTypeFilter]);

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
