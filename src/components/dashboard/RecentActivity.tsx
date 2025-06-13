
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
  const [forceUpdateKey, setForceUpdateKey] = useState<number>(0);
  const resetInProgress = useRef(false);
  const hasInitialized = useRef(false);
  
  const { 
    groupedActivities, 
    isLoading, 
    hasMoreActivities,
    showMoreActivities,
    refreshActivities
  } = useActivities();

  // Initialisation une seule fois au montage du composant
  useEffect(() => {
    if (!hasInitialized.current) {
      console.log("[RecentActivity] Initialisation du composant");
      hasInitialized.current = true;
      refreshActivities();
    }
  }, [refreshActivities]);

  // Rafraîchissement forcé uniquement quand la clé change
  useEffect(() => {
    if (forceUpdateKey > 0) {
      console.log("[RecentActivity] Rafraîchissement forcé déclenché");
      refreshActivities();
    }
  }, [forceUpdateKey, refreshActivities]);

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
    
    // Éviter les boucles multiples
    if (resetInProgress.current) return;
    
    resetInProgress.current = true;
    
    // Forcer un rafraîchissement complet
    setForceUpdateKey(prev => prev + 1);
    
    // Notification
    toast.success(t('viewReset'));
    
    // Terminer la réinitialisation après un délai
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
