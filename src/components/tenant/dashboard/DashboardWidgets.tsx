
import { useLocale } from "@/components/providers/LocaleProvider";
import { LeaseWidget } from "./widgets/LeaseWidget";
import { NotificationWidget } from "./widgets/NotificationWidget";
import { PaymentWidget } from "./widgets/PaymentWidget";
import { MaintenanceWidget } from "./widgets/MaintenanceWidget";
import { CommunicationsWidget } from "./widgets/CommunicationsWidget";
import { DocumentsWidget } from "./widgets/DocumentsWidget";
import { PaymentHistoryChart } from "./widgets/PaymentHistoryChart";
import { motion } from "framer-motion";
import type { Communication, MaintenanceRequest, Payment, TenantDocument } from "@/types/tenant";

// Define interface matching the structure provided by useTenantData
interface TenantData {
  id: string;
  name: string;
  email: string;
  unit_number: string;
  lease_start: string;
  lease_end: string;
  rent_amount: number;
  properties?: {
    name: string;
  };
}

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
  
  // Render widgets based on order and visibility
  const renderWidget = (widgetId: string, index: number) => {
    if (hiddenSections.includes(widgetId)) return null;
    
    // Determine grid column span based on widget type and screen size
    const getColSpan = () => {
      if (widgetId === 'chart') return "col-span-1 lg:col-span-3";
      if (widgetId === 'property' || widgetId === 'lease') return "col-span-1 md:col-span-1";
      return "col-span-1";
    };
    
    const widgetContent = () => {
      switch (widgetId) {
        case 'property':
          return tenant?.properties && (
            <div className="h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-2">{tenant.properties.name}</h3>
              <p className="text-gray-500 dark:text-gray-400">Unit: {tenant.unit_number}</p>
            </div>
          );
        case 'lease':
          return tenant && (
            <LeaseWidget 
              leaseStart={tenant.lease_start}
              leaseEnd={tenant.lease_end}
              daysLeft={leaseStatus.daysLeft}
              status={leaseStatus.status}
            />
          );
        case 'notifications':
          return (
            <NotificationWidget
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
        className={`${getColSpan()} h-full`}
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
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {widgetOrder.map((widgetId, index) => renderWidget(widgetId, index))}
    </motion.div>
  );
};
