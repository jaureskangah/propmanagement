
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
  const renderWidget = (widgetId: string, index: number) => {
    if (hiddenSections.includes(widgetId)) return null;
    
    const animationDelay = index * 0.1;
    
    const wrapWithAnimation = (content: React.ReactNode) => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: animationDelay }}
      >
        {content}
      </motion.div>
    );
    
    switch (widgetId) {
      case 'lease':
        return tenant && wrapWithAnimation(
          <LeaseWidget 
            leaseStart={tenant.lease_start}
            leaseEnd={tenant.lease_end}
            daysLeft={leaseStatus.daysLeft}
            status={leaseStatus.status}
          />
        );
      case 'notifications':
        return wrapWithAnimation(
          <NotificationWidget
            communications={communications}
            maintenanceRequests={maintenanceRequests}
          />
        );
      case 'payments':
        return tenant && wrapWithAnimation(
          <PaymentWidget
            rentAmount={tenant.rent_amount}
            payments={payments}
          />
        );
      case 'maintenance':
        return wrapWithAnimation(
          <MaintenanceWidget
            requests={maintenanceRequests}
          />
        );
      case 'communications':
        return wrapWithAnimation(
          <CommunicationsWidget
            communications={communications}
          />
        );
      case 'documents':
        return wrapWithAnimation(
          <DocumentsWidget
            documents={documents}
          />
        );
      case 'chart':
        return wrapWithAnimation(
          <PaymentHistoryChart
            payments={payments}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {widgetOrder.map((widgetId, index) => (
        <div key={widgetId} className={widgetId === 'chart' ? 'col-span-full' : ''}>
          {renderWidget(widgetId, index)}
        </div>
      ))}
    </div>
  );
};
