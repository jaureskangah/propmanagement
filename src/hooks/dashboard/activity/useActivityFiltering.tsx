
import { useMemo, useState } from "react";
import { Activity } from "../activityTypes";

export function useActivityFiltering(allActivities: Activity[]) {
  const [visibleActivitiesCount, setVisibleActivitiesCount] = useState<number>(5);
  const ACTIVITIES_PER_PAGE = 5;

  // Optimized activity limiting with null checks
  const limitedActivities = useMemo(() => {
    const safeActivities = Array.isArray(allActivities) ? allActivities : [];
    // Hard cap to prevent memory issues
    const maxAllowed = Math.min(safeActivities.length, 50);
    const displayCount = Math.min(visibleActivitiesCount, maxAllowed);
    
    // Simple slice instead of complex filtering
    return safeActivities.slice(0, displayCount);
  }, [allActivities, visibleActivitiesCount]);

  // Simplified hasMore calculation
  const hasMoreActivities = useMemo(() => {
    const safeActivities = Array.isArray(allActivities) ? allActivities : [];
    return safeActivities.length > limitedActivities.length && limitedActivities.length < 50;
  }, [allActivities, limitedActivities]);

  const showMoreActivities = () => {
    if (!hasMoreActivities) return;
    
    setVisibleActivitiesCount(prev => {
      const newCount = prev + ACTIVITIES_PER_PAGE;
      // Never show more than 50 activities to prevent memory issues
      return Math.min(newCount, 50);
    });
  };

  return {
    limitedActivities,
    hasMoreActivities,
    showMoreActivities
  };
}
