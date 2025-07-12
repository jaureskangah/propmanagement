
import { useLocale } from "@/components/providers/LocaleProvider";
import { LeaseStatusCard } from "./LeaseStatusCard";
import { NotificationSummary } from "./NotificationSummary";
import { PaymentWidget } from "./PaymentWidget";
import { MaintenanceWidget } from "./MaintenanceWidget";
import { CommunicationsWidget } from "./CommunicationsWidget";
import { DocumentsWidget } from "./DocumentsWidget";
import { PaymentHistoryChart } from "./widgets/PaymentHistoryChart";
import { InteractiveWidget } from "./widgets/InteractiveWidget";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { Communication, MaintenanceRequest, Payment, TenantDocument } from "@/types/tenant";
import type { TenantData } from "@/hooks/tenant/dashboard/useTenantData";

interface DashboardWidgetsProps {
  tenant: TenantData;
  communications: Communication[];
  maintenanceRequests: MaintenanceRequest[];
  payments: Payment[];
  documents: TenantDocument[];
  leaseStatus: { daysLeft: number; status: 'active' | 'expiring' | 'expired' };
  widgetOrder: string[];
  hiddenSections: string[];
}

export const DashboardWidgets = ({
  tenant,
  communications,
  maintenanceRequests,
  payments,
  documents,
  leaseStatus,
  widgetOrder,
  hiddenSections
}: DashboardWidgetsProps) => {
  const { t } = useLocale();
  const navigate = useNavigate();
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  // Filter out hidden widgets first
  const visibleWidgets = widgetOrder.filter(id => !hiddenSections.includes(id));
  
  // Take only the first 4 visible widgets for our 2x2 grid
  const gridWidgets = visibleWidgets.slice(0, 4);
  
  // Render a widget
  const renderWidget = (widgetId: string, index: number) => {
    const getWidgetAction = (widgetId: string) => {
      switch (widgetId) {
        case 'property':
          return () => navigate('/tenant/overview');
        case 'lease':
          return () => navigate('/tenant/overview');
        case 'notifications':
          return () => navigate('/tenant/communications');
        case 'payments':
          return () => navigate('/tenant/payments');
        case 'maintenance':
          return () => navigate('/tenant/maintenance');
        case 'communications':
          return () => navigate('/tenant/communications');
        case 'documents':
          return () => navigate('/tenant/documents');
        default:
          return undefined;
      }
    };

    const widgetContent = () => {
      switch (widgetId) {
        case 'property':
          return tenant?.properties && (
            <InteractiveWidget 
              onClick={getWidgetAction(widgetId)}
              actionLabel={t('viewDetails')}
              className="h-full"
            >
              <div className="h-full flex flex-col">
                <h3 className="text-lg font-semibold mb-2">{tenant.properties.name}</h3>
                <p className="text-muted-foreground">{t('unitLabel')}: {tenant.unit_number}</p>
              </div>
            </InteractiveWidget>
          );
        case 'lease':
          return tenant && (
            <InteractiveWidget 
              onClick={getWidgetAction(widgetId)}
              actionLabel={t('viewLease')}
              className="h-full"
            >
              <LeaseStatusCard 
                leaseStart={tenant.lease_start}
                leaseEnd={tenant.lease_end}
                daysLeft={leaseStatus.daysLeft}
                status={leaseStatus.status}
              />
            </InteractiveWidget>
          );
        case 'notifications':
          return (
            <InteractiveWidget 
              onClick={getWidgetAction(widgetId)}
              actionLabel={t('viewAll')}
              className="h-full"
            >
              <NotificationSummary
                communications={communications}
                maintenanceRequests={maintenanceRequests}
              />
            </InteractiveWidget>
          );
        case 'payments':
          return tenant && (
            <InteractiveWidget 
              onClick={getWidgetAction(widgetId)}
              actionLabel={t('viewPayments')}
              className="h-full"
              showAction={false}
            >
              <PaymentWidget
                rentAmount={tenant.rent_amount}
                payments={payments}
              />
            </InteractiveWidget>
          );
        case 'maintenance':
          return (
            <InteractiveWidget 
              onClick={getWidgetAction(widgetId)}
              actionLabel={t('viewRequests')}
              className="h-full"
            >
              <MaintenanceWidget
                requests={maintenanceRequests}
              />
            </InteractiveWidget>
          );
        case 'communications':
          return (
            <InteractiveWidget 
              onClick={getWidgetAction(widgetId)}
              actionLabel={t('openChat')}
              className="h-full"
            >
              <CommunicationsWidget
                communications={communications}
              />
            </InteractiveWidget>
          );
        case 'documents':
          return (
            <InteractiveWidget 
              onClick={getWidgetAction(widgetId)}
              actionLabel={t('manageDocuments')}
              className="h-full"
            >
              <DocumentsWidget
                documents={documents}
              />
            </InteractiveWidget>
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
    
    return (
      <motion.div 
        key={widgetId}
        variants={item}
        className="w-full h-full"
        initial="hidden"
        animate="show"
        transition={{ duration: 0.3, delay: index * 0.05 }}
      >
        {widgetContent()}
      </motion.div>
    );
  };
  
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 auto-rows-fr" 
    >
      {gridWidgets.map((widgetId, index) => (
        <motion.div
          key={widgetId}
          variants={item}
          className={`w-full h-full min-h-[280px] ${
            // Si c'est le graphique de paiement, on le fait prendre toute la largeur en dessous de xl
            widgetId === 'chart' ? 'md:col-span-2 xl:col-span-1' : ''
          }`}
        >
          {renderWidget(widgetId, index)}
        </motion.div>
      ))}
    </motion.div>
  );
}
