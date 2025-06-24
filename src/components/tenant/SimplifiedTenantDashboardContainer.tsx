
import React, { useState, useEffect, useMemo } from "react";
import { TubelightNavBar } from "@/components/ui/tubelight-navbar";
import { Home, Wrench, FileText, Settings } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { TenantOverview } from "./sections/TenantOverview";
import { TenantMaintenanceSection } from "./sections/TenantMaintenanceSection";
import { TenantDocumentsSection } from "./sections/TenantDocumentsSection";
import { TenantSettingsSection } from "./sections/TenantSettingsSection";
import { motion } from "framer-motion";
import type { Communication, MaintenanceRequest, TenantDocument } from "@/types/tenant";
import type { TenantData } from "@/hooks/tenant/dashboard/useTenantData";

interface SimplifiedTenantDashboardContainerProps {
  tenant: TenantData;
  communications: Communication[];
  maintenanceRequests: MaintenanceRequest[];
  documents: TenantDocument[];
  leaseStatus: { daysLeft: number; status: 'active' | 'expiring' | 'expired' };
  refreshDashboard: () => void;
}

export const SimplifiedTenantDashboardContainer = ({ 
  tenant,
  communications,
  maintenanceRequests,
  documents,
  leaseStatus,
  refreshDashboard
}: SimplifiedTenantDashboardContainerProps) => {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('tenantDashboardActiveTab') || 'overview';
  });

  // Save active tab to localStorage
  useEffect(() => {
    localStorage.setItem('tenantDashboardActiveTab', activeTab);
  }, [activeTab]);

  // Calculate dynamic counts based on real data
  const dynamicCounts = useMemo(() => {
    // Overview: Days left on lease or active status
    const overviewCount = leaseStatus.status === 'active' ? leaseStatus.daysLeft : 0;
    
    // Maintenance: Pending requests
    const pendingMaintenance = maintenanceRequests.filter(req => 
      req.status === 'Pending' || req.status === 'pending' || req.status === 'In Progress'
    ).length;
    
    // Documents: Total documents
    const documentsCount = documents.length;

    return {
      overview: overviewCount,
      maintenance: pendingMaintenance,
      documents: documentsCount,
      settings: 0 // No count needed for settings
    };
  }, [leaseStatus, maintenanceRequests, documents]);

  // Function to get contextual count for active tab
  const getCountForTab = useMemo(() => {
    return (tabValue: string) => {
      if (tabValue !== activeTab) {
        return undefined; // Don't show count for inactive tabs
      }
      
      switch (tabValue) {
        case 'overview':
          return dynamicCounts.overview > 0 ? dynamicCounts.overview : undefined;
        case 'maintenance':
          return dynamicCounts.maintenance;
        case 'documents':
          return dynamicCounts.documents;
        case 'settings':
          return undefined; // No count for settings
        default:
          return undefined;
      }
    };
  }, [activeTab, dynamicCounts]);

  const navItems = [
    { 
      name: t('overview'), 
      value: "overview", 
      icon: Home,
      count: getCountForTab('overview')
    },
    { 
      name: t('maintenance'), 
      value: "maintenance", 
      icon: Wrench,
      count: getCountForTab('maintenance')
    },
    { 
      name: t('documents'), 
      value: "documents", 
      icon: FileText,
      count: getCountForTab('documents')
    },
    { 
      name: t('settings'), 
      value: "settings", 
      icon: Settings,
      count: getCountForTab('settings')
    },
  ];

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <TenantOverview 
            tenant={tenant}
            leaseStatus={leaseStatus}
            maintenanceRequests={maintenanceRequests}
            communications={communications}
          />
        );
      case 'maintenance':
        return (
          <TenantMaintenanceSection 
            requests={maintenanceRequests}
            tenantId={tenant.id}
            onMaintenanceUpdate={refreshDashboard}
          />
        );
      case 'documents':
        return (
          <TenantDocumentsSection 
            documents={documents}
            tenantId={tenant.id}
            onDocumentUpdate={refreshDashboard}
            tenant={tenant}
          />
        );
      case 'settings':
        return (
          <TenantSettingsSection 
            tenant={tenant}
            onSettingsUpdate={refreshDashboard}
          />
        );
      default:
        return (
          <TenantOverview 
            tenant={tenant}
            leaseStatus={leaseStatus}
            maintenanceRequests={maintenanceRequests}
            communications={communications}
          />
        );
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* TubelightNavBar */}
      <TubelightNavBar
        items={navItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mb-8"
      />

      {/* Active Section Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-[500px]"
      >
        {renderActiveSection()}
      </motion.div>
    </div>
  );
};
