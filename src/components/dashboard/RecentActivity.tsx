
import { useLocale } from "@/components/providers/LocaleProvider";
import { ActivityCard } from "./activity/ActivityCard";
import { ActivityFilter } from "./activity/ActivityFilter";
import { ActivityList } from "./activity/ActivityList";
import { useActivities } from "@/hooks/dashboard/useActivities";
import { useEffect, useState } from "react";
import { NoActivity } from "./activity/NoActivity";
import { toast } from "sonner";

// Export types from the hook
export type { Activity } from "@/hooks/dashboard/activityTypes";

export const RecentActivity = () => {
  const { t } = useLocale();
  const [lastFilterChange, setLastFilterChange] = useState<number>(Date.now());
  
  const { 
    groupedActivities, 
    isLoading, 
    activityTypeFilter, 
    setActivityTypeFilter,
    hasMoreActivities,
    showMoreActivities,
    refreshActivities
  } = useActivities();

  // Function to handle filter changes
  const handleFilterChange = (newFilter: string) => {
    console.log("[RecentActivity] Changement du filtre d'activité vers:", newFilter);
    setActivityTypeFilter(newFilter);
    setLastFilterChange(Date.now());  // Marquer le changement de filtre
  };

  // Pour assurer la réactivité
  useEffect(() => {
    console.log("[RecentActivity] Mise à jour des activités après changement de filtre à:", activityTypeFilter);
    console.log("[RecentActivity] Timestamp de dernière modification:", lastFilterChange);
  }, [activityTypeFilter, lastFilterChange]);

  // For debugging
  useEffect(() => {
    console.log("[RecentActivity] Filtre d'activité actuel:", activityTypeFilter);
    console.log("[RecentActivity] Activités groupées:", groupedActivities);
    console.log("[RecentActivity] Nombre de groupes:", Object.keys(groupedActivities).length);
    
    // Notification si changement de filtre sans activités
    if (Object.keys(groupedActivities).length === 0 && !isLoading) {
      console.log(`[RecentActivity] Aucune activité trouvée pour le filtre: ${activityTypeFilter}`);
    }
  }, [activityTypeFilter, groupedActivities, isLoading]);

  // Force reload of activities when component mounts
  useEffect(() => {
    console.log("[RecentActivity] Composant monté, déclenchement du rafraîchissement initial");
    refreshActivities();
  }, []);

  // Check if there are any activities to display
  const isEmpty = Object.keys(groupedActivities).length === 0 && !isLoading;

  // Handler pour le bouton de réinitialisation du filtre
  const handleResetFilter = () => {
    console.log("[RecentActivity] Réinitialisation du filtre demandée");
    handleFilterChange("all");
    toast.success("Filtre réinitialisé");
    
    // Force refresh activities
    setTimeout(() => {
      console.log("[RecentActivity] Rafraîchissement forcé après réinitialisation");
      refreshActivities();
    }, 100);
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
