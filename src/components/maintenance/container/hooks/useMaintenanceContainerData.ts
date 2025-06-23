
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useMaintenanceContainerData = () => {
  // Fetch maintenance requests with error handling
  const { data: maintenanceRequests = [] } = useQuery({
    queryKey: ['maintenance_requests'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('maintenance_requests')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error("MaintenanceContainer - Error fetching maintenance requests:", error);
          return [];
        }
        return data || [];
      } catch (error) {
        console.error("MaintenanceContainer - Exception fetching maintenance requests:", error);
        return [];
      }
    },
    retry: false,
  });

  // Fetch maintenance tasks with error handling
  const { data: maintenanceTasks = [] } = useQuery({
    queryKey: ['maintenance_tasks'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('maintenance_tasks')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error("MaintenanceContainer - Error fetching maintenance tasks:", error);
          return [];
        }
        return data || [];
      } catch (error) {
        console.error("MaintenanceContainer - Exception fetching maintenance tasks:", error);
        return [];
      }
    },
    retry: false,
  });

  // Fetch vendors with error handling
  const { data: vendors = [] } = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('vendors')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error("MaintenanceContainer - Error fetching vendors:", error);
          return [];
        }
        return data || [];
      } catch (error) {
        console.error("MaintenanceContainer - Exception fetching vendors:", error);
        return [];
      }
    },
    retry: false,
  });

  // Fetch maintenance expenses with error handling
  const { data: maintenanceExpenses = [] } = useQuery({
    queryKey: ['maintenance_expenses'],
    queryFn: async () => {
      try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const { data, error } = await supabase
          .from('maintenance_expenses')
          .select('*')
          .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
          .order('date', { ascending: false });
        
        if (error) {
          console.error("MaintenanceContainer - Error fetching maintenance expenses:", error);
          return [];
        }
        return data || [];
      } catch (error) {
        console.error("MaintenanceContainer - Exception fetching maintenance expenses:", error);
        return [];
      }
    },
    retry: false,
  });

  return {
    maintenanceRequests,
    maintenanceTasks,
    vendors,
    maintenanceExpenses
  };
};
