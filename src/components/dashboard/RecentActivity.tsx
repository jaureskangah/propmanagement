
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
    activityTypeFilter, 
    setActivityTypeFilter,
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

  // Function to handle filter changes
  const handleFilterChange = (newFilter: string) => {
    console.log("[RecentActivity] Changement du filtre d'activité vers:", newFilter, "depuis:", activityTypeFilter);
    
    // Si on est déjà en train de réinitialiser, ne pas déclencher une autre réinitialisation
    if (resetInProgress.current) {
      console.log("[RecentActivity] Réinitialisation déjà en cours, ignoré");
      return;
    }
    
    // Appliquer le nouveau filtre
    setActivityTypeFilter(newFilter);
    
    // Si c'est le même filtre, forcer un rafraîchissement
    if (newFilter === activityTypeFilter) {
      console.log("[RecentActivity] Même filtre sélectionné, rafraîchissement forcé");
      forceCompleteRefresh();
    }
  };

  // Pour assurer la réactivité
  useEffect(() => {
    console.log("[RecentActivity] Mise à jour des activités après changement de filtre à:", activityTypeFilter);
    console.log("[RecentActivity] Nombre de groupes d'activités:", Object.keys(groupedActivities).length);
  }, [activityTypeFilter, groupedActivities]);

  // Check if there are any activities to display
  const isEmpty = Object.keys(groupedActivities).length === 0 && !isLoading;

  // Handler pour le bouton de réinitialisation du filtre
  const handleResetFilter = () => {
    console.log("[RecentActivity] Réinitialisation du filtre demandée de:", activityTypeFilter, "vers: all");
    
    // Marquer qu'une réinitialisation est en cours pour éviter les boucles
    resetInProgress.current = true;
    
    // Réinitialiser le filtre à "all"
    setActivityTypeFilter("all");
    
    // Forcer un rafraîchissement complet
    forceCompleteRefresh();
    
    // Notification
    toast.success(t('filterReset'));
    
    // Après un délai, terminer la réinitialisation
    setTimeout(() => {
      resetInProgress.current = false;
    }, 500);
  };

  return (
    <ActivityCard title={t('recentActivity')} isLoading={isLoading}>
      <ActivityFilter 
        value={activityTypeFilter} 
        onChange={handleFilterChange} 
      />
      {isEmpty ? (
        <NoActivity 
          filterType={activityTypeFilter} 
          onResetFilter={handleResetFilter} 
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
