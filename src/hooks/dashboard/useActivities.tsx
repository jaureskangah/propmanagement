
import { useState, useMemo, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { TenantActivity } from "@/components/dashboard/activity/TenantActivity";
import { PaymentActivity } from "@/components/dashboard/activity/PaymentActivity";
import { MaintenanceActivity } from "@/components/dashboard/activity/MaintenanceActivity";
import { useLocale } from "@/components/providers/LocaleProvider";
import { format, isToday, isYesterday, isSameWeek } from "date-fns";
import { fr } from "date-fns/locale";

export interface Activity {
  id: string;
  created_at: string;
  type: 'tenant' | 'payment' | 'maintenance';
  component: JSX.Element;
}

export interface GroupedActivities {
  [key: string]: Activity[];
}

export function useActivities() {
  const { t, language } = useLocale();
  const [activityTypeFilter, setActivityTypeFilter] = useState<string>("all");
  const [visibleActivitiesCount, setVisibleActivitiesCount] = useState<number>(5);
  const ACTIVITIES_PER_PAGE = 5; // Nombre d'activités à charger à chaque clic sur "Voir plus"

  const { data: tenants = [], isLoading: isLoadingTenants } = useQuery({
    queryKey: ["recent_tenants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tenants")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    refetchOnWindowFocus: false,
    refetchInterval: false
  });

  const { data: payments = [], isLoading: isLoadingPayments } = useQuery({
    queryKey: ["recent_payments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tenant_payments")
        .select(`
          *,
          tenants (
            unit_number
          )
        `)
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    refetchOnWindowFocus: false,
    refetchInterval: false
  });

  const { data: maintenance = [], isLoading: isLoadingMaintenance } = useQuery({
    queryKey: ["recent_maintenance"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("maintenance_requests")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    refetchOnWindowFocus: false,
    refetchInterval: false
  });

  // Déboguer les données récupérées
  useEffect(() => {
    console.log("Données récupérées:", {
      tenants: tenants.length,
      payments: payments.length,
      maintenance: maintenance.length
    });
  }, [tenants, payments, maintenance]);

  const allActivities = useMemo(() => {
    if (!tenants || !payments || !maintenance) return [];

    const combinedActivities: Activity[] = [
      ...tenants.map(tenant => ({
        id: tenant.id,
        created_at: tenant.created_at,
        type: 'tenant' as const,
        component: <TenantActivity tenant={tenant} />
      })),
      ...payments.map(payment => ({
        id: payment.id,
        created_at: payment.created_at,
        type: 'payment' as const,
        component: <PaymentActivity payment={payment} />
      })),
      ...maintenance.map(request => ({
        id: request.id,
        created_at: request.created_at,
        type: 'maintenance' as const,
        component: <MaintenanceActivity request={request} />
      }))
    ];

    // Tri par date décroissante
    const sorted = combinedActivities.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    console.log("Toutes les activités combinées:", sorted.length);
    return sorted;
  }, [tenants, payments, maintenance]);

  // Reset visible activities count when filter changes
  useEffect(() => {
    console.log("Le filtre a changé, réinitialisation du compteur d'activités visibles");
    setVisibleActivitiesCount(5);
  }, [activityTypeFilter]);

  // Amélioration du filtrage avec débogage amélioré
  const filteredActivities = useMemo(() => {
    console.log(`Filtrage des activités avec le type: "${activityTypeFilter}"`);
    console.log(`Nombre total d'activités avant filtrage: ${allActivities.length}`);
    
    if (activityTypeFilter === "all") {
      console.log("Retour de toutes les activités sans filtrage");
      return allActivities;
    }
    
    // Filtrer les activités par type
    const filtered = allActivities.filter(activity => {
      const isMatch = activity.type === activityTypeFilter;
      console.log(`Activité id=${activity.id} de type ${activity.type} correspond au filtre ${activityTypeFilter}? ${isMatch}`);
      return isMatch;
    });
    
    console.log(`Trouvé ${filtered.length} activités de type "${activityTypeFilter}"`);
    
    // Afficher les types disponibles si aucune correspondance
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

  const groupedActivities = useMemo(() => {
    const grouped: GroupedActivities = {};
    
    if (limitedActivities.length === 0) {
      console.log("Aucune activité à grouper après filtrage");
      return grouped;
    }
    
    limitedActivities.forEach(activity => {
      const date = new Date(activity.created_at);
      let dateKey: string;
      
      if (isToday(date)) {
        dateKey = t('today');
      } else if (isYesterday(date)) {
        dateKey = t('yesterday');
      } else if (isSameWeek(date, new Date(), { weekStartsOn: 1 })) {
        dateKey = t('thisWeek');
      } else {
        // Format en mois et année pour les activités plus anciennes
        dateKey = format(date, "MMMM yyyy", {
          locale: language === 'fr' ? fr : undefined
        });
      }
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      
      grouped[dateKey].push(activity);
    });
    
    console.log("Activités groupées par période:", Object.keys(grouped));
    return grouped;
  }, [limitedActivities, t, language]);

  // Fonction explicite pour changer le filtre
  const setActivityFilter = useCallback((newFilter: string) => {
    console.log(`Changement de filtre de "${activityTypeFilter}" à "${newFilter}"`);
    setActivityTypeFilter(newFilter);
  }, [activityTypeFilter]);

  const isLoading = isLoadingTenants || isLoadingPayments || isLoadingMaintenance;
  const hasMoreActivities = filteredActivities.length > limitedActivities.length;

  const showMoreActivities = useCallback(() => {
    setVisibleActivitiesCount(prev => prev + ACTIVITIES_PER_PAGE);
  }, [ACTIVITIES_PER_PAGE]);

  return {
    groupedActivities,
    isLoading,
    activityTypeFilter,
    setActivityTypeFilter: setActivityFilter,
    hasMoreActivities,
    showMoreActivities
  };
}
