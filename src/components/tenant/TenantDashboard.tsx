
import { useState, useEffect } from 'react';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { DashboardWidgets } from './dashboard/DashboardWidgets';
import { DashboardLoading } from './dashboard/DashboardLoading';
import { NoTenantProfile } from './dashboard/NoTenantProfile';
import { useTenantDashboard } from '@/hooks/tenant/useTenantDashboard';
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';

export const TenantDashboard = () => {
  const alwaysHiddenWidgets = ['property', 'payments', 'communications', 'chart', 'notifications'];
  
  const [sectionOrder, setSectionOrder] = useState<string[]>([]);
  const [hiddenSections, setHiddenSections] = useState<string[]>([...alwaysHiddenWidgets]);
  const { tenant, communications, maintenanceRequests, payments, documents, leaseStatus, isLoading, refreshDashboard } = useTenantDashboard();

  useEffect(() => {
    if (tenant && sectionOrder.length === 0) {
      const defaultOrder = ['lease', 'documents', 'maintenance'];
      setSectionOrder(defaultOrder);
    }
  }, [tenant, sectionOrder.length]);

  console.log("TenantDashboard - tenant:", tenant);
  console.log("TenantDashboard - isLoading:", isLoading);

  // Add error boundary for loading issues
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setLoadingTimeout(true);
      }, 15000); // 15 seconds timeout

      return () => clearTimeout(timer);
    } else {
      setLoadingTimeout(false);
    }
  }, [isLoading]);

  if (isLoading && !loadingTimeout) {
    return <DashboardLoading />;
  }

  // Show error state if loading takes too long
  if (isLoading && loadingTimeout) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle className="text-orange-800">
                Chargement trop long
              </CardTitle>
              <CardDescription className="text-orange-700">
                Le chargement de vos données prend plus de temps que prévu.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <Button 
                  onClick={() => {
                    setLoadingTimeout(false);
                    refreshDashboard();
                  }}
                  className="w-full"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Réessayer
                </Button>
              </div>
              <div className="text-center">
                <p className="text-sm text-orange-600">
                  Si le problème persiste, essayez de rafraîchir la page ou contactez le support.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
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
