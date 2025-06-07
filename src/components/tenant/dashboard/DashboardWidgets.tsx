
import { useLocale } from "@/components/providers/LocaleProvider";
import { LeaseStatusCard } from "./LeaseStatusCard";
import { NotificationSummary } from "./NotificationSummary";
import { PaymentWidget } from "./PaymentWidget";
import { MaintenanceWidget } from "./MaintenanceWidget";
import { CommunicationsWidget } from "./CommunicationsWidget";
import { DocumentsWidget } from "./DocumentsWidget";
import { PaymentHistoryChart } from "./widgets/PaymentHistoryChart";
import { motion } from "framer-motion";
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
  
  // Render a widget
  const renderWidget = (widgetId: string, index: number) => {
    const widgetContent = () => {
      switch (widgetId) {
        case 'property':
          return tenant?.properties && (
            <div className="h-full bg-white dark:bg-gray-900 dark:border-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 flex flex-col">
              <h3 className="text-lg font-semibold mb-2 dark:text-white">{tenant.properties.name}</h3>
              <p className="text-gray-500 dark:text-gray-400">{t('unitLabel')}: {tenant.unit_number}</p>
            </div>
          );
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
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 auto-rows-fr" 
    >
      {visibleWidgets.map((widgetId, index) => (
        <motion.div
          key={widgetId}
          variants={item}
          className={`w-full h-full ${
            // Ajuster les spans selon le type de widget
            widgetId === 'lease' ? 'lg:col-span-2 xl:col-span-2' : 
            widgetId === 'chart' ? 'md:col-span-2 lg:col-span-3 xl:col-span-3' : 
            ''
          }`}
          style={{ minHeight: '320px' }}
        >
          {renderWidget(widgetId, index)}
        </motion.div>
      ))}
    </motion.div>
  );
}
