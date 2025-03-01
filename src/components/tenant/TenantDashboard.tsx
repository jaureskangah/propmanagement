
import { useTenantDashboard } from "@/hooks/tenant/useTenantDashboard";
import { useState, useEffect } from "react";
import { useDashboardPreferences } from "@/components/dashboard/hooks/useDashboardPreferences";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { PropertyDisplay } from "./dashboard/PropertyDisplay";
import { NoTenantProfile } from "./dashboard/NoTenantProfile";
import { DashboardLoading } from "./dashboard/DashboardLoading";
import { DashboardWidgets } from "./dashboard/DashboardWidgets";

export const TenantDashboard = () => {
  const { 
    tenant, 
    communications, 
    maintenanceRequests, 
    payments, 
    documents, 
    leaseStatus,
    isLoading, 
    refreshDashboard 
  } = useTenantDashboard();
  
  const { preferences, updatePreferences } = useDashboardPreferences();
  
  // Define default widget order if none is set
  const defaultOrder = [
    'lease',
    'notifications',
    'payments',
    'maintenance',
    'communications',
    'documents',
    'chart'
  ];
  
  const [widgetOrder, setWidgetOrder] = useState<string[]>(
    preferences.widget_order?.length > 0 ? preferences.widget_order : defaultOrder
  );
  
  const [hiddenSections, setHiddenSections] = useState<string[]>(
    preferences.hidden_sections || []
  );
  
  // Update state when preferences load
  useEffect(() => {
    if (preferences.widget_order?.length > 0) {
      setWidgetOrder(preferences.widget_order);
    }
    if (preferences.hidden_sections) {
      setHiddenSections(preferences.hidden_sections);
    }
  }, [preferences]);
  
  const handleOrderChange = (newOrder: string[]) => {
    setWidgetOrder(newOrder);
  };
  
  const handleVisibilityChange = (hidden: string[]) => {
    setHiddenSections(hidden);
  };
  
  if (isLoading) {
    return <DashboardLoading />;
  }
  
  if (!tenant) {
    return <NoTenantProfile />;
  }
  
  return (
    <div className="space-y-6 relative pb-8">
      <DashboardHeader 
        tenantName={tenant.name}
        refreshDashboard={refreshDashboard}
        onOrderChange={handleOrderChange}
        onVisibilityChange={handleVisibilityChange}
        currentOrder={widgetOrder}
        hiddenSections={hiddenSections}
      />
      
      {tenant.properties && (
        <PropertyDisplay 
          propertyName={tenant.properties.name}
          unitNumber={tenant.unit_number}
        />
      )}
      
      <DashboardWidgets
        tenant={tenant as any}
        communications={communications}
        maintenanceRequests={maintenanceRequests}
        payments={payments}
        documents={documents}
        leaseStatus={leaseStatus}
        widgetOrder={widgetOrder}
        hiddenSections={hiddenSections}
      />
    </div>
  );
};
