
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TubelightNavBar } from "@/components/ui/tubelight-navbar";
import { DocumentGenerator } from "@/components/tenant/documents/DocumentGenerator";
import { Files, Wrench, FileText, CreditCard } from "lucide-react";
import { Tenant } from "@/types/tenant";
import { useLocale } from "@/components/providers/LocaleProvider";
import { TenantDocuments } from "@/components/tenant/TenantDocuments";
import { TenantPayments } from "@/components/tenant/TenantPayments";
import { TenantMaintenance } from "@/components/tenant/TenantMaintenance";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface TenantTabsProps {
  tenant: Tenant;
  isTenantUser: boolean;
  handleDataUpdate: () => void;
}

export const TenantTabs = ({ tenant, isTenantUser, handleDataUpdate }: TenantTabsProps) => {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState('documents');
  const isMobile = useIsMobile();

  // Calculate contextual counts for each tab
  const getCountForTab = (tabValue: string) => {
    if (tabValue !== activeTab) {
      return undefined; // Don't show count for inactive tabs
    }
    
    switch (tabValue) {
      case 'documents':
        return tenant.documents?.length || 0;
      case 'payments':
        return tenant.paymentHistory?.length || 0;
      case 'maintenance':
        return tenant.maintenanceRequests?.length || 0;
      case 'documentGenerator':
        return undefined; // No count needed for generator
      default:
        return undefined;
    }
  };

  const navItems = [
    { 
      name: t('documents'), 
      value: "documents", 
      icon: Files,
      count: getCountForTab('documents')
    },
    { 
      name: t('payments.payments'), 
      value: "payments", 
      icon: CreditCard,
      count: getCountForTab('payments')
    },
    { 
      name: t('maintenance.maintenance'), 
      value: "maintenance", 
      icon: Wrench,
      count: getCountForTab('maintenance')
    },
    { 
      name: t('documentGenerator.documentGenerator'), 
      value: "documentGenerator", 
      icon: FileText,
      count: getCountForTab('documentGenerator')
    },
  ];

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'documents':
        return (
          <TenantDocuments 
            documents={tenant.documents} 
            tenantId={tenant.id}
            onDocumentUpdate={handleDataUpdate}
            tenant={tenant}
          />
        );
      case 'payments':
        return (
          <TenantPayments 
            payments={tenant.paymentHistory || []} 
            tenantId={tenant.id}
            onPaymentUpdate={handleDataUpdate}
          />
        );
      case 'maintenance':
        return (
          <TenantMaintenance 
            requests={tenant.maintenanceRequests ? [...tenant.maintenanceRequests].sort((a, b) => 
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            ) : []}
            tenantId={tenant.id}
            onMaintenanceUpdate={handleDataUpdate}
          />
        );
      case 'documentGenerator':
        return <DocumentGenerator tenant={tenant} />;
      default:
        return (
          <TenantDocuments 
            documents={tenant.documents} 
            tenantId={tenant.id}
            onDocumentUpdate={handleDataUpdate}
            tenant={tenant}
          />
        );
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-6 pb-0">
        {/* TubelightNavBar */}
        <TubelightNavBar
          items={navItems}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className="mb-6"
        />
      </div>

      {/* Active Section Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-[400px]"
      >
        <CardContent className={cn("p-0", isMobile ? "p-2" : "p-4")}>
          {renderActiveSection()}
        </CardContent>
      </motion.div>
    </Card>
  );
};
