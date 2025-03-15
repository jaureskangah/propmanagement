
import { useState, useEffect } from 'react';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { DashboardWidgets } from './dashboard/DashboardWidgets';
import { DashboardLoading } from './dashboard/DashboardLoading';
import { NoTenantProfile } from './dashboard/NoTenantProfile';
import { useTenantDashboard } from '@/hooks/tenant/useTenantDashboard';
import { Card } from '@/components/ui/card';

export const TenantDashboard = () => {
  const [sectionOrder, setSectionOrder] = useState<string[]>([]);
  const [hiddenSections, setHiddenSections] = useState<string[]>(['payments', 'communications']);
  const { tenant, communications, maintenanceRequests, payments, documents, leaseStatus, isLoading, refreshDashboard } = useTenantDashboard();

  useEffect(() => {
    // Initialize default order if we have a tenant
    if (tenant && sectionOrder.length === 0) {
      // Set an order that prioritizes the most relevant widgets first
      // Making sure notifications is among the first 4 to be visible in the 2x2 grid
      const defaultOrder = ['property', 'lease', 'notifications', 'maintenance', 'documents', 'chart', 'payments', 'communications'];
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
    <div className="space-y-6">
      <Card className="p-6 border-none shadow-sm bg-gradient-to-r from-white to-gray-50">
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
      </Card>
      
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
    setHiddenSections(hidden);
  }
};
