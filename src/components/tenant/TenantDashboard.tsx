
import { useState, useEffect } from 'react';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { DashboardLoading } from './dashboard/DashboardLoading';
import { NoTenantProfile } from './dashboard/NoTenantProfile';
import { SimplifiedTenantDashboardContainer } from './SimplifiedTenantDashboardContainer';
import { useTenantDashboard } from '@/hooks/tenant/useTenantDashboard';
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';

export const TenantDashboard = () => {
  const { tenant, communications, maintenanceRequests, payments, documents, leaseStatus, isLoading, refreshDashboard } = useTenantDashboard();
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  console.log("=== TENANT DASHBOARD RENDER ===");
  console.log("TenantDashboard - tenant:", tenant);
  console.log("TenantDashboard - isLoading:", isLoading);
  console.log("TenantDashboard - communications:", communications?.length || 0);
  console.log("TenantDashboard - maintenanceRequests:", maintenanceRequests?.length || 0);
  console.log("TenantDashboard - documents:", documents?.length || 0);
  console.log("TenantDashboard - leaseStatus:", leaseStatus);

  // Timeout for loading state
  useEffect(() => {
    if (isLoading) {
      console.log("Setting up loading timeout...");
      const timer = setTimeout(() => {
        console.log("Loading timeout triggered");
        setLoadingTimeout(true);
      }, 10000); // Reduced to 10 seconds

      return () => {
        console.log("Clearing loading timeout");
        clearTimeout(timer);
      };
    } else {
      console.log("Clearing loading timeout state");
      setLoadingTimeout(false);
    }
  }, [isLoading]);

  // Show loading state only for a reasonable time
  if (isLoading && !loadingTimeout) {
    console.log("Showing loading state");
    return <DashboardLoading />;
  }

  // Show error state if loading takes too long
  if (loadingTimeout) {
    console.log("Showing timeout error state");
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

  // Show no tenant profile if tenant is null/undefined
  if (!tenant) {
    console.log("No tenant found, showing NoTenantProfile");
    return <NoTenantProfile />;
  }

  console.log("Rendering full tenant dashboard");
  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 space-y-6 max-w-7xl">
      <DashboardHeader 
        tenantName={tenant.name || ""}
        firstName={tenant.firstName}
        lastName={tenant.lastName}
        refreshDashboard={refreshDashboard}
        onOrderChange={() => {}} // Not needed in simplified version
        onVisibilityChange={() => {}} // Not needed in simplified version
        currentOrder={[]}
        hiddenSections={[]}
      />
      
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <SimplifiedTenantDashboardContainer 
          tenant={tenant}
          communications={communications}
          maintenanceRequests={maintenanceRequests}
          documents={documents}
          leaseStatus={leaseStatus}
          refreshDashboard={refreshDashboard}
        />
      </motion.div>
    </div>
  );
};
