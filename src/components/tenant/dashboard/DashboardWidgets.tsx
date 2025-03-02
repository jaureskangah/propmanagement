
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
      case 'property':
        return tenant?.properties && (
          <div className="col-span-1">
            <div className="h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-2">{tenant.properties.name}</h3>
              <p className="text-gray-500 dark:text-gray-400">Unit: {tenant.unit_number}</p>
            </div>
          </div>
        );
      case 'lease':
        return tenant && (
          <div className="col-span-1">
            <LeaseWidget 
              leaseStart={tenant.lease_start}
              leaseEnd={tenant.lease_end}
              daysLeft={leaseStatus.daysLeft}
              status={leaseStatus.status}
            />
          </div>
        );
      case 'notifications':
        return (
          <div className="col-span-1">
            <NotificationWidget
              communications={communications}
              maintenanceRequests={maintenanceRequests}
            />
          </div>
        );
      case 'payments':
        return tenant && (
          <div className="col-span-1">
            <PaymentWidget
              rentAmount={tenant.rent_amount}
              payments={payments}
            />
          </div>
        );
      case 'maintenance':
        return (
          <div className="col-span-1">
            <MaintenanceWidget
              requests={maintenanceRequests}
            />
          </div>
        );
      case 'communications':
        return (
          <div className="col-span-1">
            <CommunicationsWidget
              communications={communications}
            />
          </div>
        );
      case 'documents':
        return (
          <div className="col-span-1">
            <DocumentsWidget
              documents={documents}
            />
          </div>
        );
      case 'chart':
        return (
          <div className="col-span-full">
            <PaymentHistoryChart
              payments={payments}
            />
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {widgetOrder.map(widgetId => renderWidget(widgetId))}
    </div>
  );
};
