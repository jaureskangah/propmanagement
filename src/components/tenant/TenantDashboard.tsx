
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
          <LeaseStatusCard 
            leaseStart={tenant.lease_start}
            leaseEnd={tenant.lease_end}
            daysLeft={leaseStatus.daysLeft}
            status={leaseStatus.status}
          />
        );
      case 'notifications':
        return (
          <NotificationSummary
            communications={communications}
            maintenanceRequests={maintenanceRequests}
          />
        );
      case 'payments':
        return tenant && (
          <PaymentWidget
            rentAmount={tenant.rent_amount}
            payments={payments}
          />
        );
      case 'maintenance':
        return (
          <MaintenanceWidget
            requests={maintenanceRequests}
          />
        );
      case 'communications':
        return (
          <CommunicationsWidget
            communications={communications}
          />
        );
      case 'documents':
        return (
          <DocumentsWidget
            documents={documents}
          />
        );
      case 'chart':
        return (
          <PaymentHistoryChart
            payments={payments}
          />
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
            <Skeleton key={i} className="h-[200px] w-full" />
          ))}
        </div>
      </div>
    );
  }
  
  if (!tenant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Home className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold text-center mb-2">
          {t('noTenantProfile')}
        </h2>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          {t('noTenantProfileDescription')}
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 relative">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          {t('welcomeTenant', { name: tenant.name.split(' ')[0] })}
        </h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshDashboard}
          className="flex items-center gap-1"
        >
          <RefreshCw className="h-4 w-4" />
          {t('refresh')}
        </Button>
      </div>
      
      <DashboardCustomization 
        onOrderChange={handleOrderChange}
        onVisibilityChange={handleVisibilityChange}
        currentOrder={widgetOrder}
        hiddenSections={hiddenSections}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgetOrder.map(widgetId => (
          <div key={widgetId}>
            {renderWidget(widgetId)}
          </div>
        ))}
      </div>
    </div>
  );
};
