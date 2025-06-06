
import { useState, useEffect } from 'react';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { DashboardWidgets } from './dashboard/DashboardWidgets';
import { DashboardLoading } from './dashboard/DashboardLoading';
import { NoTenantProfile } from './dashboard/NoTenantProfile';
import { useTenantDashboard } from '@/hooks/tenant/useTenantDashboard';
import { motion } from "framer-motion";

export const TenantDashboard = () => {
  // Widgets to always hide from the dashboard
  const alwaysHiddenWidgets = ['property', 'payments', 'communications', 'chart'];
  
  const [sectionOrder, setSectionOrder] = useState<string[]>([]);
  const [hiddenSections, setHiddenSections] = useState<string[]>([...alwaysHiddenWidgets]);
  const { tenant, communications, maintenanceRequests, payments, documents, leaseStatus, isLoading, refreshDashboard } = useTenantDashboard();

  useEffect(() => {
    if (tenant && sectionOrder.length === 0) {
      const defaultOrder = ['lease', 'notifications', 'documents', 'maintenance'];
      setSectionOrder(defaultOrder);
    }
  }, [tenant, sectionOrder.length]);

  console.log("TenantDashboard - tenant:", tenant);
  console.log("TenantDashboard - isLoading:", isLoading);

  if (isLoading) {
    return <DashboardLoading />;
  }

  if (!tenant) {
    return <NoTenantProfile />;
  }

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 space-y-6 max-w-7xl">
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
      
      <motion.div 
        className="grid gap-4 sm:gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
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
      </motion.div>
    </div>
  );

  function handleOrderChange(newOrder: string[]) {
    setSectionOrder(newOrder);
  }

  function handleVisibilityChange(hidden: string[]) {
    const updatedHidden = [...new Set([...hidden, ...alwaysHiddenWidgets])];
    setHiddenSections(updatedHidden);
  }
};
