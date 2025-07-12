
import React, { Suspense } from 'react';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ProgressiveLoader } from './dashboard/ProgressiveLoader';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { DashboardLoading } from './dashboard/DashboardLoading';
import { NoTenantProfile } from './dashboard/NoTenantProfile';
import { SimplifiedTenantDashboardContainer } from './SimplifiedTenantDashboardContainer';
import { useTenantDashboard } from '@/hooks/tenant/useTenantDashboard';
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { useSafeTranslation } from '@/hooks/useSafeTranslation';

// Detect mobile/tablet devices
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const TenantDashboardContent = () => {
  const { tenant, communications, maintenanceRequests, payments, documents, leaseStatus, isLoading, refreshDashboard } = useTenantDashboard();
  const { t } = useSafeTranslation();
  const isMobile = isMobileDevice();

  console.log("=== OPTIMIZED TENANT DASHBOARD RENDER ===");
  console.log("Tenant exists:", !!tenant);
  console.log("Is mobile device:", isMobile);
  console.log("Loading state:", isLoading);

  // Show loading for a reasonable time
  if (isLoading && !tenant) {
    return <DashboardLoading />;
  }

  // Show no tenant profile if no tenant found
  if (!tenant && !isLoading) {
    return <NoTenantProfile />;
  }

  // Show error state if tenant data is incomplete
  if (tenant && (!tenant.id || !tenant.name)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
            <CardTitle className="text-orange-800">
              {t('dataIncomplete', 'Données incomplètes')}
            </CardTitle>
            <CardDescription className="text-orange-700">
              {t('tenantDataIncomplete', 'Les données de votre profil locataire sont incomplètes.')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={refreshDashboard} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              {t('retry', 'Réessayer')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 space-y-6 max-w-7xl">
      <ErrorBoundary
        fallback={
          <Card className="p-6 border-red-200 bg-red-50">
            <CardContent>
              <p className="text-red-800">{t('headerError', 'Erreur lors du chargement de l\'en-tête')}</p>
            </CardContent>
          </Card>
        }
      >
        <ProgressiveLoader delay={isMobile ? 200 : 100}>
          <DashboardHeader 
            tenantName={tenant?.name || ""}
            firstName={tenant?.firstName}
            lastName={tenant?.lastName}
            refreshDashboard={refreshDashboard}
          />
        </ProgressiveLoader>
      </ErrorBoundary>
      
      <ErrorBoundary
        fallback={
          <Card className="p-6 border-red-200 bg-red-50">
            <CardContent>
              <p className="text-red-800">{t('dashboardError', 'Erreur lors du chargement du tableau de bord')}</p>
              <Button onClick={refreshDashboard} className="mt-4">
                <RefreshCw className="mr-2 h-4 w-4" />
                {t('retry', 'Réessayer')}
              </Button>
            </CardContent>
          </Card>
        }
      >
        <ProgressiveLoader delay={isMobile ? 400 : 200}>
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: isMobile ? 0.3 : 0.5 }}
          >
            <SimplifiedTenantDashboardContainer 
              tenant={tenant}
              communications={communications || []}
              maintenanceRequests={maintenanceRequests || []}
              documents={documents || []}
              leaseStatus={leaseStatus}
              refreshDashboard={refreshDashboard}
            />
          </motion.div>
        </ProgressiveLoader>
      </ErrorBoundary>
    </div>
  );
};

export const OptimizedTenantDashboard = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<DashboardLoading />}>
        <TenantDashboardContent />
      </Suspense>
    </ErrorBoundary>
  );
};
