
import { useLocale } from "@/components/providers/LocaleProvider";
import { ActivityCard } from "./activity/ActivityCard";
import { ActivityFilter } from "./activity/ActivityFilter";
import { ActivityList } from "./activity/ActivityList";
import { useActivities, Activity } from "@/hooks/dashboard/useActivities";

// Export Activity type for other components
export type { Activity };

export const RecentActivity = () => {
  const { t } = useLocale();
  const { 
    groupedActivities, 
    isLoading, 
    activityTypeFilter, 
    setActivityTypeFilter,
    hasMoreActivities,
    showMoreActivities
  } = useActivities();

  // Fonction de gestion du changement de filtre
  const handleFilterChange = (newFilter: string) => {
    console.log("Setting activity filter to:", newFilter);
    setActivityTypeFilter(newFilter);
  };

  return (
    <ActivityCard title={t('recentActivity')} isLoading={isLoading}>
      <ActivityFilter 
        value={activityTypeFilter} 
        onChange={handleFilterChange} 
      />
      <ActivityList 
        groupedActivities={groupedActivities} 
        hasMoreActivities={hasMoreActivities}
        onShowMore={showMoreActivities}
      />
    </ActivityCard>
  );
};
