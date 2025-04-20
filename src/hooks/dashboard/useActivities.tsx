
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
  const activitiesRef = useRef<any[]>([]);
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
      activitiesRef.current = [...allActivities];
    }
  }, [allActivities]);

  const {
    limitedActivities,
    hasMoreActivities,
    showMoreActivities
  } = useActivityFiltering(allActivities);

  // Group the limited activities
  const groupedActivities = useActivityGrouping(limitedActivities);

  // Function to force a complete refresh of activities
  const refreshActivities = () => {
    console.log("[useActivities] Forcing complete refresh of activities");
    setRefreshTrigger(Date.now());
  };

  const isLoading = isLoadingTenants || isLoadingPayments || isLoadingMaintenance;

  return {
    groupedActivities,
    isLoading,
    hasMoreActivities,
    showMoreActivities,
    refreshActivities
  };
}
