
import { useMemo, useCallback, useState, useEffect } from "react";
import { Activity } from "../activityTypes";

export function useActivityFiltering(allActivities: Activity[]) {
  const [activityTypeFilter, setActivityTypeFilter] = useState<string>("all");
  const [visibleActivitiesCount, setVisibleActivitiesCount] = useState<number>(5);
  const ACTIVITIES_PER_PAGE = 5;

  // Reset visible activities count when filter changes
  useEffect(() => {
    console.log("Le filtre a changé, réinitialisation du compteur d'activités visibles");
    setVisibleActivitiesCount(5);
  }, [activityTypeFilter]);

  // Enhanced filtering with improved debugging
  const filteredActivities = useMemo(() => {
    console.log(`Filtrage des activités avec le type: "${activityTypeFilter}"`);
    console.log(`Nombre total d'activités avant filtrage: ${allActivities.length}`);
    
    if (activityTypeFilter === "all") {
      console.log("Retour de toutes les activités sans filtrage");
      return allActivities;
    }
    
    // Check if we have activities before filtering
    if (allActivities.length === 0) {
      console.log("Aucune activité à filtrer");
      return [];
    }
    
    // Filter activities by type
    const filtered = allActivities.filter(activity => {
      const isMatch = activity.type === activityTypeFilter;
      console.log(`Activité id=${activity.id} de type ${activity.type} correspond au filtre ${activityTypeFilter}? ${isMatch}`);
      return isMatch;
    });
    
    console.log(`Trouvé ${filtered.length} activités de type "${activityTypeFilter}"`);
    
    // Display available types if no matches
    if (filtered.length === 0 && allActivities.length > 0) {
      console.log("Types d'activités disponibles:", 
        [...new Set(allActivities.map(a => a.type))]
      );
    }
    
    return filtered;
  }, [allActivities, activityTypeFilter]);

  const limitedActivities = useMemo(() => {
    return filteredActivities.slice(0, visibleActivitiesCount);
  }, [filteredActivities, visibleActivitiesCount]);

  const setActivityFilter = useCallback((newFilter: string) => {
    console.log(`Changement de filtre de "${activityTypeFilter}" à "${newFilter}"`);
    setActivityTypeFilter(newFilter);
  }, [activityTypeFilter]);

  const hasMoreActivities = filteredActivities.length > limitedActivities.length;

  const showMoreActivities = useCallback(() => {
    setVisibleActivitiesCount(prev => prev + ACTIVITIES_PER_PAGE);
  }, [ACTIVITIES_PER_PAGE]);

  return {
    filteredActivities,
    limitedActivities,
    activityTypeFilter,
    setActivityFilter,
    hasMoreActivities,
    showMoreActivities
  };
}
