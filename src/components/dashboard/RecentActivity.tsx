
import { useLocale } from "@/components/providers/LocaleProvider";
import { ActivityCard } from "./activity/ActivityCard";
import { ActivityFilter } from "./activity/ActivityFilter";
import { ActivityList } from "./activity/ActivityList";
import { useActivities } from "@/hooks/dashboard/useActivities";
import { useEffect, useRef, useState } from "react";
import { NoActivity } from "./activity/NoActivity";
import { toast } from "sonner";

// Export types from the hook
export type { Activity } from "@/hooks/dashboard/activityTypes";

export const RecentActivity = () => {
  const { t } = useLocale();
  const [forceUpdateKey, setForceUpdateKey] = useState<number>(Date.now());
  const resetInProgress = useRef(false);
  
  const { 
    groupedActivities, 
    isLoading, 
    hasMoreActivities,
    showMoreActivities,
    refreshActivities
  } = useActivities();

  // Force reload of activities when component mounts or forceUpdateKey changes
  useEffect(() => {
    console.log("[RecentActivity] Composant monté ou rafraîchissement forcé, déclenchement du rafraîchissement");
    refreshActivities();
  }, [forceUpdateKey, refreshActivities]);

  // Function to force a complete refresh of activities
  const forceCompleteRefresh = () => {
    console.log("[RecentActivity] Forçage d'un rafraîchissement complet");
    setForceUpdateKey(Date.now());
  };

  // Pour assurer la réactivité
  useEffect(() => {
    console.log("[RecentActivity] Mise à jour des activités");
    console.log("[RecentActivity] Nombre de groupes d'activités:", Object.keys(groupedActivities).length);
  }, [groupedActivities]);

  // Check if there are any activities to display
  const isEmpty = Object.keys(groupedActivities).length === 0 && !isLoading;

  // Simple reset handler for NoActivity component
  const handleResetView = () => {
    console.log("[RecentActivity] Réinitialisation de la vue demandée");
    
    // Marquer qu'une réinitialisation est en cours pour éviter les boucles
    resetInProgress.current = true;
    
    // Forcer un rafraîchissement complet
    forceCompleteRefresh();
    
    // Notification
    toast.success(t('viewReset'));
    
    // Après un délai, terminer la réinitialisation
    setTimeout(() => {
      resetInProgress.current = false;
    }, 500);
  };

  return (
    <ActivityCard title={t('recentActivity')} isLoading={isLoading}>
      <ActivityFilter />
      {isEmpty ? (
        <NoActivity 
          onReset={handleResetView} 
        />
      ) : (
        <ActivityList 
          groupedActivities={groupedActivities} 
          hasMoreActivities={hasMoreActivities}
          onShowMore={showMoreActivities}
        />
      )}
    </ActivityCard>
  );
};
