
import { useMemo } from "react";

interface MaintenanceData {
  maintenanceRequests: any[];
  maintenanceTasks: any[];
  vendors: any[];
  maintenanceExpenses: any[];
}

export const useMaintenanceCounts = ({
  maintenanceRequests,
  maintenanceTasks,
  vendors,
  maintenanceExpenses
}: MaintenanceData) => {
  // Calculate dynamic counts based on real data with safe fallbacks
  const dynamicCounts = useMemo(() => {
    try {
      const overviewCount = Array.isArray(maintenanceRequests) ? maintenanceRequests.length : 0;
      
      const requestsCount = Array.isArray(maintenanceRequests) 
        ? maintenanceRequests.filter(req => req?.status === 'Pending' || req?.status === 'pending').length 
        : 0;
      
      const tasksCount = Array.isArray(maintenanceTasks) 
        ? maintenanceTasks.filter(task => !task?.completed && task?.status !== 'completed').length 
        : 0;
      
      const vendorsCount = Array.isArray(vendors) ? vendors.length : 0;
      
      const financesCount = Array.isArray(maintenanceExpenses) ? maintenanceExpenses.length : 0;

      return {
        overview: overviewCount,
        requests: requestsCount,
        tasks: tasksCount,
        vendors: vendorsCount,
        finances: financesCount
      };
    } catch (error) {
      console.error("MaintenanceCounts - Error calculating counts:", error);
      return {
        overview: 0,
        requests: 0,
        tasks: 0,
        vendors: 0,
        finances: 0
      };
    }
  }, [maintenanceRequests, maintenanceTasks, vendors, maintenanceExpenses]);

  // Function to get contextual count for active tab
  const getCountForTab = (tabValue: string) => {
    try {
      switch (tabValue) {
        case 'overview':
          return dynamicCounts.overview;
        case 'requests':
          return dynamicCounts.requests;
        case 'tasks':
          return dynamicCounts.tasks;
        case 'vendors':
          return dynamicCounts.vendors;
        case 'finances':
          return dynamicCounts.finances;
        default:
          return undefined;
      }
    } catch (error) {
      console.error("MaintenanceCounts - Error getting count for tab:", tabValue, error);
      return 0;
    }
  };

  return {
    dynamicCounts,
    getCountForTab
  };
};
