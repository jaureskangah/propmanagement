
import { useQuery } from "@tanstack/react-query";
import { ActivityCard } from "./activity/ActivityCard";
import { TenantActivity } from "./activity/TenantActivity";
import { PaymentActivity } from "./activity/PaymentActivity";
import { MaintenanceActivity } from "./activity/MaintenanceActivity";
import { useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLocale } from "@/components/providers/LocaleProvider";
import { motion, AnimatePresence } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { format, isToday, isYesterday, isSameWeek } from "date-fns";
import { fr } from "date-fns/locale";

interface Activity {
  id: string;
  created_at: string;
  type: 'tenant' | 'payment' | 'maintenance';
  component: JSX.Element;
}

interface GroupedActivities {
  [key: string]: Activity[];
}

export const RecentActivity = () => {
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

  // Animation variants for container
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Animation variants for individual items
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  // Animation variants for date headers
  const headerVariants = {
    hidden: { opacity: 0, x: -10 },
    show: { 
      opacity: 1, 
      x: 0,
      transition: {
        delay: 0.1,
        duration: 0.4
      }
    }
  };

  return (
    <ActivityCard title={t('recentActivity')} isLoading={isLoading}>
      <div className="mb-4 flex justify-end">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={activityTypeFilter} onValueChange={setActivityTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('filterBy')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('all')}</SelectItem>
              <SelectItem value="tenant">{t('tenant')}</SelectItem>
              <SelectItem value="payment">{t('payment')}</SelectItem>
              <SelectItem value="maintenance">{t('maintenance')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        {Object.keys(groupedActivities).length === 0 ? (
          <motion.p 
            key="no-activity"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-4 text-muted-foreground italic"
          >
            {t('noActivity')}
          </motion.p>
        ) : (
          <motion.div 
            key="activity-groups"
            className="space-y-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {Object.entries(groupedActivities).map(([dateGroup, activities]) => (
              <motion.div 
                key={dateGroup} 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <motion.h3 
                  className="text-sm font-medium text-muted-foreground border-b pb-1"
                  variants={headerVariants}
                >
                  {dateGroup}
                </motion.h3>
                <motion.div 
                  variants={container}
                  className="space-y-4"
                >
                  <AnimatePresence>
                    {activities.map(activity => (
                      <motion.div 
                        key={`${activity.type}-${activity.id}`}
                        variants={itemVariants}
                        whileHover={{ 
                          scale: 1.01, 
                          transition: { duration: 0.2 } 
                        }}
                        layout
                      >
                        {activity.component}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </ActivityCard>
  );
};
