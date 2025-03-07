
import { useLocale } from "@/components/providers/LocaleProvider";
import { ActivityCard } from "./activity/ActivityCard";
import { ActivityFilter } from "./activity/ActivityFilter";
import { ActivityList } from "./activity/ActivityList";
import { useActivities } from "@/hooks/dashboard/useActivities";

export type { Activity } from "@/hooks/dashboard/useActivities";

export const RecentActivity = () => {
  const { t } = useLocale();
  const { 
    groupedActivities, 
    isLoading, 
    activityTypeFilter, 
    setActivityTypeFilter 
  } = useActivities();

  return (
    <ActivityCard title={t('recentActivity')} isLoading={isLoading}>
      <ActivityFilter 
        value={activityTypeFilter} 
        onChange={setActivityTypeFilter} 
      />
      <ActivityList groupedActivities={groupedActivities} />
    </ActivityCard>
  );
};
