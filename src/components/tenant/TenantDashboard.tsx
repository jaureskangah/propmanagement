
import { useTenantDashboard } from "@/hooks/tenant/useTenantDashboard";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useState, useEffect } from "react";
import { LeaseStatusCard } from "./dashboard/LeaseStatusCard";
import { NotificationSummary } from "./dashboard/NotificationSummary";
import { PaymentWidget } from "./dashboard/PaymentWidget";
import { DocumentsWidget } from "./dashboard/DocumentsWidget";
import { MaintenanceWidget } from "./dashboard/MaintenanceWidget";
import { CommunicationsWidget } from "./dashboard/CommunicationsWidget";
import { PaymentHistoryChart } from "./dashboard/PaymentHistoryChart";
import { DashboardCustomization } from "./dashboard/DashboardCustomization";
import { useDashboardPreferences } from "@/components/dashboard/hooks/useDashboardPreferences";
import { Skeleton } from "@/components/ui/skeleton";
import { Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardMetric } from "@/components/DashboardMetric";
import { motion } from "framer-motion";

export const TenantDashboard = () => {
  const { t } = useLocale();
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
  
  // Render widgets based on order and visibility
  const renderWidget = (widgetId: string) => {
    if (hiddenSections.includes(widgetId)) return null;
    
    switch (widgetId) {
      case 'lease':
        return tenant && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <LeaseStatusCard 
              leaseStart={tenant.lease_start}
              leaseEnd={tenant.lease_end}
              daysLeft={leaseStatus.daysLeft}
              status={leaseStatus.status}
            />
          </motion.div>
        );
      case 'notifications':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <NotificationSummary
              communications={communications}
              maintenanceRequests={maintenanceRequests}
            />
          </motion.div>
        );
      case 'payments':
        return tenant && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <PaymentWidget
              rentAmount={tenant.rent_amount}
              payments={payments}
            />
          </motion.div>
        );
      case 'maintenance':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <MaintenanceWidget
              requests={maintenanceRequests}
            />
          </motion.div>
        );
      case 'communications':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <CommunicationsWidget
              communications={communications}
            />
          </motion.div>
        );
      case 'documents':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <DocumentsWidget
              documents={documents}
            />
          </motion.div>
        );
      case 'chart':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
            className="col-span-full"
          >
            <PaymentHistoryChart
              payments={payments}
            />
          </motion.div>
        );
      default:
        return null;
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">
            <Skeleton className="h-10 w-40" />
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }
  
  if (!tenant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 shadow-sm">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Home className="h-20 w-20 text-blue-300 mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-center mb-4 text-blue-800">
            {t('noTenantProfile')}
          </h2>
          <p className="text-muted-foreground text-center max-w-md mb-8 text-lg">
            {t('noTenantProfileDescription')}
          </p>
          <Button 
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
            onClick={() => window.location.href = '/tenant/profile'}
          >
            Configurer votre profil
          </Button>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 relative pb-8">
      <div className="flex items-center justify-between mb-6 bg-background sticky top-0 z-10 pt-2 pb-4 backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600"
        >
          {t('welcomeTenant', { name: tenant.name.split(' ')[0] })}
        </motion.h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshDashboard}
            className="flex items-center gap-1 hover:bg-blue-50 hover:text-blue-700 transition-all"
          >
            <RefreshCw className="h-4 w-4" />
            {t('refresh')}
          </Button>
          <DashboardCustomization 
            onOrderChange={handleOrderChange}
            onVisibilityChange={handleVisibilityChange}
            currentOrder={widgetOrder}
            hiddenSections={hiddenSections}
          />
        </div>
      </div>
      
      {tenant.properties && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <DashboardMetric
            title={t('property')}
            value={tenant.properties.name}
            description={`Appartement ${tenant.unit_number}`}
            icon={<Home className="h-5 w-5" />}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 border-none shadow-md"
          />
        </motion.div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {widgetOrder.map(widgetId => (
          <div key={widgetId} className={widgetId === 'chart' ? 'col-span-full' : ''}>
            {renderWidget(widgetId)}
          </div>
        ))}
      </div>
    </div>
  );
};
