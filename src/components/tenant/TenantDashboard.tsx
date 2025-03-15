
import { useState, useEffect } from 'react';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { DashboardWidgets } from './dashboard/DashboardWidgets';
import { DashboardLoading } from './dashboard/DashboardLoading';
import { NoTenantProfile } from './dashboard/NoTenantProfile';
import { useTenantDashboard } from '@/hooks/tenant/useTenantDashboard';

export const TenantDashboard = () => {
  // Widgets to always hide from the dashboard
  const alwaysHiddenWidgets = ['property', 'payments', 'communications', 'chart'];
  
  const [sectionOrder, setSectionOrder] = useState<string[]>([]);
  const [hiddenSections, setHiddenSections] = useState<string[]>([...alwaysHiddenWidgets]);
  const { tenant, communications, maintenanceRequests, payments, documents, leaseStatus, isLoading, refreshDashboard } = useTenantDashboard();

  useEffect(() => {
    // Initialize default order if we have a tenant
    if (tenant && sectionOrder.length === 0) {
      // Set an order that prioritizes the most relevant widgets first
      const defaultOrder = ['lease', 'notifications', 'documents', 'maintenance'];
      setSectionOrder(defaultOrder);
    }
  }, [tenant, sectionOrder.length]);

  // Handle loading state
  if (isLoading) {
    return <DashboardLoading />;
  }

  // Handle case where tenant profile doesn't exist
  if (!tenant) {
    return <NoTenantProfile />;
  }

  return (
    <div className="space-y-8">
      <DashboardHeader 
        tenantName={tenant.name || ""}
        firstName={tenant.firstName}
        lastName={tenant.lastName}
        refreshDashboard={refreshDashboard}
        onOrderChange={handleOrderChange}
        onVisibilityChange={handleVisibilityChange}
        currentOrder={sectionOrder}
        hiddenSections={hiddenSections}
      />
      
      <DashboardWidgets 
        tenant={tenant}
        communications={communications}
        maintenanceRequests={maintenanceRequests}
        payments={payments}
        documents={documents}
        leaseStatus={leaseStatus}
        widgetOrder={sectionOrder}
        hiddenSections={hiddenSections}
      />
    </div>
  );

  // Handle layout customization
  function handleOrderChange(newOrder: string[]) {
    setSectionOrder(newOrder);
  }

  function handleVisibilityChange(hidden: string[]) {
    // Make sure the always hidden widgets stay hidden
    const updatedHidden = [...new Set([...hidden, ...alwaysHiddenWidgets])];
    setHiddenSections(updatedHidden);
  }
};
