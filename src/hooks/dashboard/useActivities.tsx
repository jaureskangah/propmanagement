
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
  // Référence pour suivre les changements d'activités
  const activitiesRef = useRef<any[]>([]);
  // Forcer le rafraîchissement des activités
  const [refreshTrigger, setRefreshTrigger] = useState<number>(Date.now());
  
  const { data: tenants = [], isLoading: isLoadingTenants } = useTenantActivities();
  const { data: payments = [], isLoading: isLoadingPayments } = usePaymentActivities();
  const { data: maintenance = [], isLoading: isLoadingMaintenance } = useMaintenanceActivities();

  // Debug the retrieved data
  useEffect(() => {
    console.log("[useActivities] Données récupérées:", {
      tenants: tenants.length,
      payments: payments.length,
      maintenance: maintenance.length
    });
  }, [tenants, payments, maintenance]);

  const allActivities = useTransformedActivities(tenants, payments, maintenance);
  
  // Vérifier si les activités ont changé
  useEffect(() => {
    const allActivitiesCount = allActivities.length;
    const prevActivitiesCount = activitiesRef.current.length;
    
    if (allActivitiesCount !== prevActivitiesCount) {
      console.log(`[useActivities] Changement détecté dans les activités: avant=${prevActivitiesCount}, après=${allActivitiesCount}`);
      activitiesRef.current = allActivities;
    }
  }, [allActivities]);
  
  // Log the transformed activities to help debugging
  useEffect(() => {
    console.log("[useActivities] Activités transformées:", {
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
    console.log("[useActivities] Activités groupées après filtrage:", {
      filtre: activityTypeFilter,
      groupes: Object.keys(groupedActivities),
      nombreTotal: Object.values(groupedActivities).flat().length,
      forceUpdate: forceUpdate
    });
  }, [groupedActivities, activityTypeFilter, forceUpdate]);

  // Fonction pour forcer le rafraîchissement complet des activités
  const refreshActivities = () => {
    console.log("[useActivities] Forçage du rafraîchissement complet des activités");
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
