
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
  
  // Filter out hidden widgets first
  const visibleWidgets = widgetOrder.filter(id => !hiddenSections.includes(id));
  
  // Take only the first 4 visible widgets for our 2x2 grid
  const gridWidgets = visibleWidgets.slice(0, 4);
  
  // Render a widget
  const renderWidget = (widgetId: string, index: number) => {
    const widgetContent = () => {
      switch (widgetId) {
        case 'property':
          return tenant?.properties && (
            <div className="h-full bg-white dark:bg-gray-900 dark:border-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 flex flex-col">
              <h3 className="text-lg font-semibold mb-2 dark:text-white">{tenant.properties.name}</h3>
              <p className="text-gray-500 dark:text-gray-400">Unit: {tenant.unit_number}</p>
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
        className="w-full h-full transform transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md rounded-xl overflow-hidden dark:bg-gray-800/90 dark:backdrop-blur-sm dark:border dark:border-gray-700/80"
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
      className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-fr" 
    >
      {gridWidgets.map((widgetId, index) => renderWidget(widgetId, index))}
    </motion.div>
  );
}
