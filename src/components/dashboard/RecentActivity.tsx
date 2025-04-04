
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
    showMoreActivities
  } = useActivities();

  // Function to handle filter changes
  const handleFilterChange = (newFilter: string) => {
    console.log("Changement du filtre d'activité vers:", newFilter);
    setActivityTypeFilter(newFilter);
    setLastFilterChange(Date.now());  // Marquer le changement de filtre
  };

  // Pour assurer la réactivité
  useEffect(() => {
    console.log("Mise à jour des activités après changement de filtre à:", activityTypeFilter);
  }, [activityTypeFilter, lastFilterChange]);

  // For debugging
  useEffect(() => {
    console.log("Filtre d'activité actuel:", activityTypeFilter);
    console.log("Activités groupées:", groupedActivities);
    console.log("Nombre de groupes:", Object.keys(groupedActivities).length);
    
    // Notification si changement de filtre sans activités
    if (Object.keys(groupedActivities).length === 0 && !isLoading) {
      console.log(`Aucune activité trouvée pour le filtre: ${activityTypeFilter}`);
    }
  }, [activityTypeFilter, groupedActivities, isLoading]);

  // Check if there are any activities to display
  const isEmpty = Object.keys(groupedActivities).length === 0 && !isLoading;

  return (
    <ActivityCard title={t('recentActivity')} isLoading={isLoading}>
      <ActivityFilter 
        value={activityTypeFilter} 
        onChange={handleFilterChange} 
      />
      {isEmpty ? (
        <NoActivity filterType={activityTypeFilter} onResetFilter={() => handleFilterChange("all")} />
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
