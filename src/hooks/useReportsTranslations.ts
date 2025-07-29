
import { useLocale } from "@/components/providers/LocaleProvider";

export const useReportsTranslations = () => {
  const { t } = useLocale();
  
  const getTranslation = (key: string, fallback: string) => {
    return t(key, { fallback });
  };

  // Common report translations
  const translations = {
    // Navigation
    analytics: getTranslation('analytics', 'Analytics'),
    financial: getTranslation('financial', 'Financial'),
    properties: getTranslation('properties', 'Properties'),
    tenants: getTranslation('tenants', 'Tenants'),
    performance: getTranslation('performance', 'Performance'),
    
    // Headers
    advancedReports: getTranslation('advancedReports', 'Advanced Reports'),
    analyticsDescription: getTranslation('analyticsDescription', 'Analytics dashboards and performance metrics'),
    analyticsMode: getTranslation('analyticsMode', 'Analytics'),
    
    // Loading states
    loadingReports: getTranslation('loadingReports', 'Loading reports...'),
    
    // Analytics
    analyticsOverview: getTranslation('analyticsOverview', 'Analytics Overview'),
    comprehensiveAnalytics: getTranslation('comprehensiveAnalytics', 'Comprehensive analysis of your real estate data'),
    
    // Metrics
    totalProperties: getTranslation('totalProperties', 'Total Properties'),
    totalTenants: getTranslation('totalTenants', 'Total Tenants'),
    occupancyRate: getTranslation('occupancyRate', 'Occupancy Rate'),
    totalRevenue: getTranslation('totalRevenue', 'Total Revenue'),
    pendingMaintenance: getTranslation('pendingMaintenance', 'Pending Maintenance'),
    
    // Charts
    revenueEvolution: getTranslation('revenueEvolution', 'Revenue Evolution'),
    maintenanceByPriority: getTranslation('maintenanceByPriority', 'Maintenance by Priority'),
    maintenanceByStatus: getTranslation('maintenanceByStatus', 'Maintenance by Status'),
    occupancyTrends: getTranslation('occupancyTrends', 'Occupancy Trends'),
    currentOccupancy: getTranslation('currentOccupancy', 'Current Occupancy'),
    activeTenants: getTranslation('activeTenants', 'Active Tenants'),
    totalUnits: getTranslation('totalUnits', 'Total Units'),
    
    // Common terms
    revenue: getTranslation('revenue', 'Revenue'),
    requests: getTranslation('requests', 'Requests'),
    month: getTranslation('month', 'Month')
  };

  return { ...translations, t: getTranslation };
};
