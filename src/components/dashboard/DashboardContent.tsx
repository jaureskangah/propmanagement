
import { DashboardMetrics } from "./DashboardMetrics";
import { useMaintenanceAlerts } from "@/hooks/useMaintenanceAlerts";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { PrioritySection } from "./PrioritySection";
import { RevenueChart } from "./RevenueChart";
import { RecentActivity } from "./RecentActivity";
import { useDashboardPreferences } from "./hooks/useDashboardPreferences";
import { DateRange } from "./DashboardDateFilter";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { AIAssistant } from "@/components/ai/AIAssistant";

interface DashboardContentProps {
  isLoading: boolean;
  metrics: any;
  dateRange: DateRange;
}

export const DashboardContent = ({ isLoading, dateRange }: DashboardContentProps) => {
  useRealtimeNotifications();
  const { notifications, budgetAlerts, paymentAlerts } = useMaintenanceAlerts();
  const { preferences } = useDashboardPreferences();

  // Fetch properties, maintenance, and tenants data
  const { data: propertiesData = [] } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data, error } = await supabase.from('properties').select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: maintenanceData = [] } = useQuery({
    queryKey: ['maintenance_requests'],
    queryFn: async () => {
      const { data, error } = await supabase.from('maintenance_requests').select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: tenantsData = [] } = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase.from('tenants').select('*').eq('user_id', user.id);
      if (error) throw error;
      return data;
    }
  });

  const { data: paymentsData = [] } = useQuery({
    queryKey: ['tenant_payments'],
    queryFn: async () => {
      const { data, error } = await supabase.from('tenant_payments').select('*');
      if (error) throw error;
      return data;
    }
  });

  // Log dateRange changes for debugging
  useEffect(() => {
    console.log("DashboardContent received date range:", dateRange);
  }, [dateRange]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full dark:border-white dark:border-t-transparent"></div>
      </div>
    );
  }

  const isHidden = (sectionId: string) => preferences.hidden_sections.includes(sectionId);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-10"
    >
      {!isHidden('metrics') && (
        <motion.div variants={item} className="rounded-xl bg-gradient-to-br from-background/80 to-muted/30 backdrop-blur-sm border border-border/40 p-4 shadow-sm dark:from-gray-900/80 dark:to-gray-800/30 dark:border-gray-700/40">
          <DashboardMetrics 
            propertiesData={propertiesData}
            maintenanceData={maintenanceData}
            tenantsData={tenantsData}
            dateRange={dateRange}
          />
        </motion.div>
      )}

      {!isHidden('priority') && (
        <motion.div variants={item} className="rounded-xl bg-gradient-to-br from-background/80 to-muted/30 backdrop-blur-sm border border-border/40 p-4 shadow-sm transition-all duration-200 hover:shadow-md dark:from-gray-900/80 dark:to-gray-800/30 dark:border-gray-700/40">
          <PrioritySection
            maintenanceData={maintenanceData}
            tenantsData={tenantsData}
            paymentsData={paymentsData}
          />
        </motion.div>
      )}

      {!isHidden('revenue') && (
        <motion.div variants={item} className="rounded-xl bg-gradient-to-br from-background/80 to-muted/30 backdrop-blur-sm border border-border/40 p-4 shadow-sm transition-all duration-200 hover:shadow-md dark:from-gray-900/80 dark:to-gray-800/30 dark:border-gray-700/40">
          <RevenueChart />
        </motion.div>
      )}

      {!isHidden('activity') && (
        <motion.div variants={item} className="rounded-xl bg-gradient-to-br from-background/80 to-muted/30 backdrop-blur-sm border border-border/40 p-4 shadow-sm transition-all duration-200 hover:shadow-md dark:from-gray-900/80 dark:to-gray-800/30 dark:border-gray-700/40">
          <RecentActivity />
        </motion.div>
      )}

      {!isHidden('assistant') && (
        <motion.div variants={item} className="rounded-xl bg-gradient-to-br from-background/80 to-muted/30 backdrop-blur-sm border border-border/40 p-4 shadow-sm transition-all duration-200 hover:shadow-md dark:from-gray-900/80 dark:to-gray-800/30 dark:border-gray-700/40">
          <AIAssistant />
        </motion.div>
      )}
    </motion.div>
  );
};
