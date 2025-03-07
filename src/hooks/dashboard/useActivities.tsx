
import { useState, useMemo } from "react";
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

  const { data: tenants = [], isLoading: isLoadingTenants } = useQuery({
    queryKey: ["recent_tenants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tenants")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);
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
        .limit(3);
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
        .limit(3);
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    refetchOnWindowFocus: false,
    refetchInterval: false
  });

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

    return combinedActivities.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [tenants, payments, maintenance]);

  // Filter activities based on selected type
  const filteredActivities = useMemo(() => {
    if (activityTypeFilter === "all") {
      return allActivities;
    }
    return allActivities.filter(activity => activity.type === activityTypeFilter);
  }, [allActivities, activityTypeFilter]);

  // Group activities by date
  const groupedActivities = useMemo(() => {
    const grouped: GroupedActivities = {};
    
    filteredActivities.forEach(activity => {
      const date = new Date(activity.created_at);
      let dateKey: string;
      
      if (isToday(date)) {
        dateKey = t('today');
      } else if (isYesterday(date)) {
        dateKey = t('yesterday');
      } else if (isSameWeek(date, new Date(), { weekStartsOn: 1 })) {
        dateKey = t('thisWeek');
      } else {
        // Format as month and year for older activities
        dateKey = format(date, "MMMM yyyy", {
          locale: language === 'fr' ? fr : undefined
        });
      }
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      
      grouped[dateKey].push(activity);
    });
    
    return grouped;
  }, [filteredActivities, t, language]);

  const isLoading = isLoadingTenants || isLoadingPayments || isLoadingMaintenance;

  return {
    groupedActivities,
    isLoading,
    activityTypeFilter,
    setActivityTypeFilter
  };
}
