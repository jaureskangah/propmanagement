
import { useLocale } from "@/components/providers/LocaleProvider";
import { ActivityCard } from "./activity/ActivityCard";
import { ActivityFilter } from "./activity/ActivityFilter";
import { ActivityList } from "./activity/ActivityList";
import { useActivities, Activity } from "@/hooks/dashboard/useActivities";
import { useEffect } from "react";
import { NoActivity } from "./activity/NoActivity";

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

  // Function to handle filter changes
  const handleFilterChange = (newFilter: string) => {
    console.log("Setting activity filter to:", newFilter);
    setActivityTypeFilter(newFilter);
  };

  // For debugging
  useEffect(() => {
    console.log("Current activityTypeFilter:", activityTypeFilter);
    console.log("Grouped activities:", groupedActivities);
    console.log("Groups count:", Object.keys(groupedActivities).length);
  }, [activityTypeFilter, groupedActivities]);

  // Check if there are any activities to display
  const isEmpty = Object.keys(groupedActivities).length === 0;

  return (
    <ActivityCard title={t('recentActivity')} isLoading={isLoading}>
      <ActivityFilter 
        value={activityTypeFilter} 
        onChange={handleFilterChange} 
      />
      {isEmpty ? (
        <NoActivity />
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
