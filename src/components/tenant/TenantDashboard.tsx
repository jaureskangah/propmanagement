
import { useState, useEffect } from 'react';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { DashboardWidgets } from './dashboard/DashboardWidgets';
import { DashboardLoading } from './dashboard/DashboardLoading';
import { NoTenantProfile } from './dashboard/NoTenantProfile';
import { useTenantDashboard } from '@/hooks/tenant/useTenantDashboard';

export const TenantDashboard = () => {
  const [sectionOrder, setSectionOrder] = useState<string[]>([]);
  const [hiddenSections, setHiddenSections] = useState<string[]>([]);
  const { tenant, communications, maintenanceRequests, payments, documents, leaseStatus, isLoading, refreshDashboard } = useTenantDashboard();

  useEffect(() => {
    // Initialize default order if we have a tenant
    if (tenant && sectionOrder.length === 0) {
      const defaultOrder = ['property', 'lease', 'notifications', 'payments', 'maintenance', 'communications', 'documents', 'chart'];
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
    <>
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
    </>
  );

  // Handle layout customization
  function handleOrderChange(newOrder: string[]) {
    setSectionOrder(newOrder);
  }

  function handleVisibilityChange(hidden: string[]) {
    setHiddenSections(hidden);
  }
};
