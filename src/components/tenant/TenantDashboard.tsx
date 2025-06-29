
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

  console.log("=== TENANT DASHBOARD RENDER DEBUG ===");
  console.log("TenantDashboard - tenant exists:", !!tenant);
  console.log("TenantDashboard - tenant ID:", tenant?.id);
  console.log("TenantDashboard - isLoading:", isLoading);
  console.log("TenantDashboard - loadingTimeout:", loadingTimeout);
  console.log("TenantDashboard - will render dashboard:", !isLoading && !!tenant);

  // Timeout réduit pour un meilleur UX
  useEffect(() => {
    if (isLoading) {
      console.log("Setting up loading timeout (8 seconds)...");
      const timer = setTimeout(() => {
        console.log("Loading timeout triggered after 8 seconds");
        setLoadingTimeout(true);
      }, 8000); // Réduit à 8 secondes

      return () => {
        console.log("Clearing loading timeout");
        clearTimeout(timer);
      };
    } else {
      console.log("Not loading, clearing timeout state");
      setLoadingTimeout(false);
    }
  }, [isLoading]);

  // CORRECTION: Afficher le loading seulement si vraiment nécessaire
  if (isLoading && !loadingTimeout && !tenant) {
    console.log("RENDER: Showing loading state");
    return <DashboardLoading />;
  }

  // Afficher l'erreur de timeout seulement si on a vraiment attendu trop longtemps
  if (loadingTimeout && !tenant) {
    console.log("RENDER: Showing timeout error state");
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
                    console.log("User clicked retry button");
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

  // CORRECTION: Afficher NoTenantProfile seulement si on n'est pas en train de charger
  if (!tenant && !isLoading) {
    console.log("RENDER: No tenant found, showing NoTenantProfile");
    return <NoTenantProfile />;
  }

  // CORRECTION: Afficher le dashboard dès que le tenant est disponible
  if (tenant) {
    console.log("RENDER: Rendering full tenant dashboard");
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
  }

  // Fallback - ne devrait jamais être atteint
  console.log("RENDER: Fallback loading state");
  return <DashboardLoading />;
};
