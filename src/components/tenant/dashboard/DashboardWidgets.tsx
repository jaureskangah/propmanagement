
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
  
  // Render widgets based on order and visibility
  const renderWidget = (widgetId: string) => {
    if (hiddenSections.includes(widgetId)) return null;
    
    switch (widgetId) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-1 pb-8">
      {widgetOrder.map((widgetId, index) => (
        <motion.div 
          key={widgetId} 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5, 
            delay: index * 0.1 + 0.2,
            ease: "easeOut"
          }}
          className={`${widgetId === 'chart' ? 'col-span-full' : ''} hover:shadow-md transition-shadow rounded-lg`}
        >
          {renderWidget(widgetId)}
        </motion.div>
      ))}
    </div>
  );
};
