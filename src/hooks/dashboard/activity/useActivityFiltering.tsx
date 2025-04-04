
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

  // Afficher le nombre total d'activités disponibles au chargement
  useEffect(() => {
    console.log(`[useActivityFiltering] Nombre total d'activités chargées: ${allActivities.length}`);
    console.log("[useActivityFiltering] Types d'activités disponibles:", 
      [...new Set(allActivities.map(a => a.type))]);
    
    // Liste détaillée des activités pour le débogage
    if (allActivities.length > 0) {
      console.log(`[useActivityFiltering] Premiers exemples d'activités:`);
      allActivities.slice(0, 3).forEach((activity, index) => {
        console.log(`[useActivityFiltering] Activité ${index}: type=${activity.type}, id=${activity.id}, date=${activity.created_at}`);
      });
    }
  }, [allActivities]);

  // Reset visible activities count when filter changes
  useEffect(() => {
    console.log(`[useActivityFiltering] Le filtre a changé de "${previousFilterRef.current}" à "${activityTypeFilter}". Réinitialisation du compteur.`);
    setVisibleActivitiesCount(5);
    previousFilterRef.current = activityTypeFilter;
    
    // Forcer une mise à jour
    setForceUpdate(Date.now());
  }, [activityTypeFilter]);

  // Enhanced filtering with improved debugging
  const filteredActivities = useMemo(() => {
    console.log(`[useActivityFiltering] Recalcul des activités filtrées. Filtre actuel: "${activityTypeFilter}". Force update: ${forceUpdate}`);
    console.log(`[useActivityFiltering] Nombre total d'activités disponibles: ${allActivities.length}`);
    
    // Check if we have activities before filtering
    if (allActivities.length === 0) {
      console.log("[useActivityFiltering] Aucune activité à filtrer");
      return [];
    }
    
    if (activityTypeFilter === "all") {
      console.log("[useActivityFiltering] Retour de toutes les activités sans filtrage");
      return allActivities;
    }
    
    // Log available types for debugging
    const availableTypes = [...new Set(allActivities.map(a => a.type))];
    console.log("[useActivityFiltering] Types d'activités disponibles:", availableTypes);
    
    // Filter activities by type
    const filtered = allActivities.filter(activity => {
      return activity.type === activityTypeFilter;
    });
    
    console.log(`[useActivityFiltering] Trouvé ${filtered.length} activités de type "${activityTypeFilter}"`);
    return filtered;
  }, [allActivities, activityTypeFilter, forceUpdate]);

  const limitedActivities = useMemo(() => {
    console.log(`[useActivityFiltering] Limitant à ${visibleActivitiesCount} activités sur ${filteredActivities.length} disponibles`);
    return filteredActivities.slice(0, visibleActivitiesCount);
  }, [filteredActivities, visibleActivitiesCount]);

  const setActivityFilter = useCallback((newFilter: string) => {
    console.log(`[useActivityFiltering] Changement de filtre demandé de "${activityTypeFilter}" à "${newFilter}"`);
    
    // Si on sélectionne le même filtre, forcer un rafraîchissement
    if (newFilter === activityTypeFilter) {
      console.log("[useActivityFiltering] Même filtre sélectionné à nouveau, forçage du rafraîchissement");
      setForceUpdate(Date.now());
      toast.info(t('refreshing'));
    } else {
      setActivityTypeFilter(newFilter);
    }
  }, [activityTypeFilter, t]);

  const resetFilter = useCallback(() => {
    console.log("[useActivityFiltering] Réinitialisation complète du filtre");
    setActivityTypeFilter("all");
    setForceUpdate(Date.now());
    toast.success(t('filterReset'));
  }, [t]);

  const hasMoreActivities = filteredActivities.length > limitedActivities.length;

  const showMoreActivities = useCallback(() => {
    console.log("[useActivityFiltering] Affichage de plus d'activités demandé");
    // Si toutes les activités sont déjà visibles, on ne fait rien
    if (!hasMoreActivities) {
      console.log("[useActivityFiltering] Toutes les activités sont déjà visibles");
      return;
    }
    
    // Sinon on augmente le nombre d'activités visibles
    setVisibleActivitiesCount(prev => {
      const newCount = prev + ACTIVITIES_PER_PAGE;
      console.log(`[useActivityFiltering] Augmentation du nombre d'activités visibles de ${prev} à ${newCount}`);
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
