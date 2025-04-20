import { useMemo, useCallback, useState, useEffect, useRef } from "react";
import { Activity } from "../activityTypes";
import { toast } from "sonner";
import { useLocale } from "@/components/providers/LocaleProvider";

export function useActivityFiltering(allActivities: Activity[]) {
  const { t } = useLocale();
  const [activityTypeFilter, setActivityTypeFilter] = useState<string>("all");
  const [visibleActivitiesCount, setVisibleActivitiesCount] = useState<number>(5);
  const previousFilterRef = useRef<string>("all");
  const [forceUpdate, setForceUpdate] = useState<number>(Date.now());
  const ACTIVITIES_PER_PAGE = 5;

  // Log the number of total activities available at load time
  useEffect(() => {
    console.log(`[useActivityFiltering] Total number of activities loaded: ${allActivities.length}`);
    console.log("[useActivityFiltering] Available activity types:", 
      [...new Set(allActivities.map(a => a.type))]);
    
    // Detailed list of activities for debugging
    if (allActivities.length > 0) {
      console.log(`[useActivityFiltering] First examples of activities:`);
      allActivities.slice(0, 3).forEach((activity, index) => {
        console.log(`[useActivityFiltering] Activity ${index}: type=${activity.type}, id=${activity.id}, date=${activity.created_at}`);
      });
    }
  }, [allActivities]);

  // Reset visible activities count when filter changes
  useEffect(() => {
    console.log(`[useActivityFiltering] Filter changed from "${previousFilterRef.current}" to "${activityTypeFilter}". Resetting counter.`);
    setVisibleActivitiesCount(5);
    previousFilterRef.current = activityTypeFilter;
    
    // Force an update
    setForceUpdate(Date.now());
  }, [activityTypeFilter]);

  // Enhanced filtering with improved debugging
  const filteredActivities = useMemo(() => {
    console.log(`[useActivityFiltering] Recalculating filtered activities. Current filter: "${activityTypeFilter}". Force update: ${forceUpdate}`);
    console.log(`[useActivityFiltering] Total number of available activities: ${allActivities.length}`);
    
    // Check if we have activities before filtering
    if (!allActivities || allActivities.length === 0) {
      console.log("[useActivityFiltering] No activities to filter");
      return [];
    }
    
    if (activityTypeFilter === "all") {
      console.log("[useActivityFiltering] Returning all activities without filtering");
      return [...allActivities]; // Return a new array to ensure reactivity
    }
    
    // Log available types for debugging
    const availableTypes = [...new Set(allActivities.map(a => a.type))];
    console.log("[useActivityFiltering] Available activity types:", availableTypes);
    
    // Filter activities by type
    const filtered = allActivities.filter(activity => {
      return activity.type === activityTypeFilter;
    });
    
    console.log(`[useActivityFiltering] Found ${filtered.length} activities of type "${activityTypeFilter}"`);
    return filtered;
  }, [allActivities, activityTypeFilter, forceUpdate]);

  const limitedActivities = useMemo(() => {
    console.log(`[useActivityFiltering] Limiting to ${visibleActivitiesCount} activities out of ${filteredActivities.length} available`);
    return filteredActivities.slice(0, visibleActivitiesCount);
  }, [filteredActivities, visibleActivitiesCount]);

  const setActivityFilter = useCallback((newFilter: string) => {
    console.log(`[useActivityFiltering] Filter change requested from "${activityTypeFilter}" to "${newFilter}"`);
    
    // If selecting the same filter, force a refresh
    if (newFilter === activityTypeFilter) {
      console.log("[useActivityFiltering] Same filter selected again, forcing refresh");
      setForceUpdate(Date.now());
      toast.info(t('refreshing'));
    } else {
      setActivityTypeFilter(newFilter);
    }
  }, [activityTypeFilter, t]);

  const resetFilter = useCallback(() => {
    console.log("[useActivityFiltering] Complete filter reset");
    setActivityTypeFilter("all");
    setForceUpdate(Date.now());
    toast.success(t('filterReset'));
  }, [t]);

  const hasMoreActivities = filteredActivities.length > limitedActivities.length;

  const showMoreActivities = useCallback(() => {
    console.log("[useActivityFiltering] Request to show more activities");
    // If all activities are already visible, do nothing
    if (!hasMoreActivities) {
      console.log("[useActivityFiltering] All activities are already visible");
      return;
    }
    
    // Otherwise increase the number of visible activities
    setVisibleActivitiesCount(prev => {
      const newCount = prev + ACTIVITIES_PER_PAGE;
      console.log(`[useActivityFiltering] Increasing number of visible activities from ${prev} to ${newCount}`);
      return newCount;
    });
  }, [hasMoreActivities, ACTIVITIES_PER_PAGE]);

  return {
    filteredActivities,
    limitedActivities,
    activityTypeFilter,
    setActivityFilter,
    resetFilter,
    hasMoreActivities,
    showMoreActivities,
    forceUpdate
  };
}
