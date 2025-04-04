
import { useQuery } from "@tanstack/react-query";
import { FinancialData } from "./types";
import {
  fetchPropertyTenants,
  fetchTenantPayments,
  fetchMaintenanceExpenses,
  fetchVendorInterventions,
  fetchPropertyDetails,
  fetchPreviousPeriodData
} from "./utils/dataFetchers";
import {
  createDefaultFinancialData,
  mapToFinancialData
} from "./utils/dataMappers";

/**
 * Hook that fetches and calculates financial metrics for a property
 */
export function useFinancialMetricsData(propertyId: string | null) {
  return useQuery({
    queryKey: ['financial_metrics', propertyId],
    queryFn: async (): Promise<FinancialData | null> => {
      if (!propertyId) return null;

      console.log("Fetching financial metrics for property:", propertyId);
      
      try {
        // Fetch tenants
        const tenants = await fetchPropertyTenants(propertyId);
        
        // If no tenants, return default data
        if (tenants.length === 0) {
          return createDefaultFinancialData();
        }
        
        // Get tenant IDs
        const tenantIds = tenants.map(t => t.id);
        
        // Fetch current period data
        const [payments, maintenanceExpenses, vendorInterventions, property] = await Promise.all([
          fetchTenantPayments(tenantIds),
          fetchMaintenanceExpenses(propertyId),
          fetchVendorInterventions(propertyId),
          fetchPropertyDetails(propertyId)
        ]);
        
        // Fetch previous period data
        const prevData = await fetchPreviousPeriodData(propertyId, tenantIds);
        
        // Map data to the required format
        return mapToFinancialData({
          tenants,
          payments,
          maintenanceExpenses,
          vendorInterventions,
          property,
          prevData
        });
        
      } catch (error) {
        console.error("Error in useFinancialMetricsData:", error);
        throw error;
      }
    },
    enabled: !!propertyId
  });
}
