
import { useEffect, useRef, useState } from "react";
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
  // Reference to track activity changes
  const activitiesRef = useRef<any[]>([]);
  // Force refresh activities
  const [refreshTrigger, setRefreshTrigger] = useState<number>(Date.now());
  
  const { data: tenants = [], isLoading: isLoadingTenants } = useTenantActivities();
  const { data: payments = [], isLoading: isLoadingPayments } = usePaymentActivities();
  const { data: maintenance = [], isLoading: isLoadingMaintenance } = useMaintenanceActivities();

  // Debug the retrieved data
  useEffect(() => {
    console.log("[useActivities] Retrieved data:", {
      tenants: tenants.length,
      payments: payments.length,
      maintenance: maintenance.length
    });
  }, [tenants, payments, maintenance]);

  const allActivities = useTransformedActivities(tenants, payments, maintenance);
  
  // Check if activities have changed
  useEffect(() => {
    const allActivitiesCount = allActivities.length;
    const prevActivitiesCount = activitiesRef.current.length;
    
    if (allActivitiesCount !== prevActivitiesCount) {
      console.log(`[useActivities] Change detected in activities: before=${prevActivitiesCount}, after=${allActivitiesCount}`);
      activitiesRef.current = [...allActivities]; // Use a new array to ensure reference change
    }
  }, [allActivities]);
  
  // Log the transformed activities to help debugging
  useEffect(() => {
    console.log("[useActivities] Transformed activities:", {
      count: allActivities.length,
      types: [...new Set(allActivities.map(a => a.type))],
      firstFew: allActivities.slice(0, 3)
    });
  }, [allActivities]);
  
  const {
    limitedActivities,
    activityTypeFilter,
    setActivityFilter,
    resetFilter,
    hasMoreActivities,
    showMoreActivities,
    forceUpdate
  } = useActivityFiltering(allActivities);

  // Force update groupedActivities when filter changes
  const groupedActivities = useActivityGrouping(limitedActivities);
  
  // Debug the final grouped activities
  useEffect(() => {
    console.log("[useActivities] Grouped activities after filtering:", {
      filter: activityTypeFilter,
      groups: Object.keys(groupedActivities),
      totalCount: Object.values(groupedActivities).flat().length,
      forceUpdate: forceUpdate
    });
  }, [groupedActivities, activityTypeFilter, forceUpdate]);

  // Function to force a complete refresh of activities
  const refreshActivities = () => {
    console.log("[useActivities] Forcing complete refresh of activities");
    setRefreshTrigger(Date.now());
  };

  const isLoading = isLoadingTenants || isLoadingPayments || isLoadingMaintenance;

  return {
    groupedActivities,
    isLoading,
    activityTypeFilter,
    setActivityTypeFilter: setActivityFilter,
    resetFilter,
    hasMoreActivities,
    showMoreActivities,
    refreshActivities
  };
}
