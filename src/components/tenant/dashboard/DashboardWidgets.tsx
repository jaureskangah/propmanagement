
import { useState, useEffect } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { LeaseStatusCard } from "./LeaseStatusCard";
import { NotificationSummary } from "./NotificationSummary";
import { PaymentWidget } from "./PaymentWidget";
import { DocumentsWidget } from "./DocumentsWidget";
import { MaintenanceWidget } from "./MaintenanceWidget";
import { CommunicationsWidget } from "./CommunicationsWidget";
import { PaymentHistoryChart } from "./PaymentHistoryChart";
import { motion } from "framer-motion";
import type { Tenant } from "@/types/tenant";
import type { Communication, MaintenanceRequest, Payment, TenantDocument } from "@/types/tenant";

interface DashboardWidgetsProps {
  tenant: Tenant;
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
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {widgetOrder.map(widgetId => (
        <div key={widgetId} className={widgetId === 'chart' ? 'col-span-full' : ''}>
          {renderWidget(widgetId)}
        </div>
      ))}
    </div>
  );
};
