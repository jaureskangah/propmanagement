
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
export function useFinancialMetricsData(propertyId: string | null, selectedYear: number) {
  return useQuery({
    queryKey: ['financial_metrics', propertyId, selectedYear],
    queryFn: async (): Promise<FinancialData | null> => {
      if (!propertyId) return null;

      console.log("Fetching financial metrics for property:", propertyId, "year:", selectedYear);
      
      try {
        // Fetch tenants
        const tenants = await fetchPropertyTenants(propertyId);
        console.log("Fetched tenants:", tenants.length);
        
        // If no tenants, return default data
        if (tenants.length === 0) {
          console.log("No tenants found, returning default data");
          return createDefaultFinancialData();
        }
        
        // Get tenant IDs
        const tenantIds = tenants.map(t => t.id);
        
        // Fetch current period data for selected year
        const [payments, maintenanceExpenses, vendorInterventions, property] = await Promise.all([
          fetchTenantPayments(tenantIds, selectedYear),
          fetchMaintenanceExpenses(propertyId, selectedYear),
          fetchVendorInterventions(propertyId, selectedYear),
          fetchPropertyDetails(propertyId)
        ]);
        
        console.log("Data fetched for year:", selectedYear, {
          payments: payments.length,
          maintenanceExpenses: maintenanceExpenses.length,
          vendorInterventions: vendorInterventions.length,
          property
        });
        
        // Fetch previous period data
        const prevData = await fetchPreviousPeriodData(propertyId, tenantIds, selectedYear);
        
        // Map data to the required format
        const financialData = mapToFinancialData({
          tenants,
          payments,
          maintenanceExpenses,
          vendorInterventions,
          property,
          prevData,
          selectedYear
        });
        
        console.log("Calculated financial metrics for year:", selectedYear, financialData);
        return financialData;
        
      } catch (error) {
        console.error("Error in useFinancialMetricsData:", error);
        throw error;
      }
    },
    enabled: !!propertyId
  });
}
