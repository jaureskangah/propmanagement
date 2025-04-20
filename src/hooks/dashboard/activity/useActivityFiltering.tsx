
import { useMemo, useState } from "react";
import { Activity } from "../activityTypes";

export function useActivityFiltering(allActivities: Activity[]) {
  const [visibleActivitiesCount, setVisibleActivitiesCount] = useState<number>(5);
  const ACTIVITIES_PER_PAGE = 5;

  // Simply limit activities without filtering
  const limitedActivities = useMemo(() => {
    console.log(`[useActivityFiltering] Limiting to ${visibleActivitiesCount} activities out of ${allActivities.length} available`);
    return allActivities.slice(0, visibleActivitiesCount);
  }, [allActivities, visibleActivitiesCount]);

  const hasMoreActivities = allActivities.length > limitedActivities.length;

  const showMoreActivities = () => {
    console.log("[useActivityFiltering] Request to show more activities");
    if (!hasMoreActivities) {
      console.log("[useActivityFiltering] All activities are already visible");
      return;
    }
    
    setVisibleActivitiesCount(prev => {
      const newCount = prev + ACTIVITIES_PER_PAGE;
      console.log(`[useActivityFiltering] Increasing number of visible activities from ${prev} to ${newCount}`);
      return newCount;
    });
  };

  return {
    limitedActivities,
    hasMoreActivities,
    showMoreActivities
  };
}
