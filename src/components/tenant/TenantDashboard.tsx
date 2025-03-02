
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

  // Format the full name for display
  const fullName = tenant.first_name && tenant.last_name 
    ? `${tenant.first_name} ${tenant.last_name}`
    : tenant.name || "";

  // Handle layout customization
  const handleOrderChange = (newOrder: string[]) => {
    setSectionOrder(newOrder);
  };

  const handleVisibilityChange = (hidden: string[]) => {
    setHiddenSections(hidden);
  };

  return (
    <>
      <DashboardHeader 
        tenantName={fullName}
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
};
