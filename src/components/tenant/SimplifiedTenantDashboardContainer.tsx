
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

// Helper function to format days counter
const formatDaysCounter = (daysLeft: number, status: 'active' | 'expiring' | 'expired'): string | undefined => {
  if (status === 'expired') {
    return undefined; // Don't show counter for expired leases
  }
  
  if (status === 'active' && daysLeft > 0) {
    return `${daysLeft}j`;
  }
  
  if (status === 'expiring' && daysLeft > 0) {
    return `${daysLeft}j`;
  }
  
  return undefined;
};

// Centralized and memoized function to calculate pending maintenance requests
const calculatePendingMaintenance = (requests: MaintenanceRequest[]): number => {
  if (!Array.isArray(requests) || requests.length === 0) return 0;
  
  return requests.filter(req => {
    if (!req.status) return false;
    const status = req.status.toLowerCase();
    return status === 'pending' || status === 'in progress' || status === 'en attente' || status === 'en cours';
  }).length;
};

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

  // Memoize dynamic counts to prevent recalculations and ensure consistency
  const dynamicCounts = useMemo(() => {
    console.log("=== CALCULATING UNIFIED DYNAMIC COUNTS ===");
    console.log("Maintenance requests:", maintenanceRequests?.length || 0);
    console.log("Maintenance requests statuses:", maintenanceRequests?.map(r => ({ id: r.id, status: r.status })) || []);
    
    // Overview: Format days left with "j" suffix for active/expiring leases
    const overviewCount = formatDaysCounter(leaseStatus.daysLeft, leaseStatus.status);
    
    // Maintenance: Use centralized calculation for consistency
    const pendingMaintenance = calculatePendingMaintenance(maintenanceRequests || []);
    console.log("Calculated pending maintenance:", pendingMaintenance);
    
    // Documents: Total documents
    const documentsCount = documents?.length || 0;

    const counts = {
      overview: overviewCount,
      maintenance: pendingMaintenance,
      documents: documentsCount,
      settings: undefined // No count needed for settings
    };
    
    console.log("Final unified counts:", counts);
    return counts;
  }, [leaseStatus.daysLeft, leaseStatus.status, maintenanceRequests, documents]); // Dépendances stables

  // Memoized function to get contextual count for active tab
  const getCountForTab = useMemo(() => {
    return (tabValue: string) => {
      if (tabValue !== activeTab) {
        return undefined; // Don't show count for inactive tabs
      }
      
      switch (tabValue) {
        case 'overview':
          return dynamicCounts.overview;
        case 'maintenance':
          return dynamicCounts.maintenance || undefined; // Convert 0 to undefined for cleaner display
        case 'documents':
          return dynamicCounts.documents || undefined;
        case 'settings':
          return undefined; // No count for settings
        default:
          return undefined;
      }
    };
  }, [activeTab, dynamicCounts]);

  // Memoized nav items to prevent recreation on every render
  const navItems = useMemo(() => [
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
  ], [t, getCountForTab]);

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <TenantOverview 
            tenant={tenant}
            leaseStatus={leaseStatus}
            maintenanceRequests={maintenanceRequests || []}
            communications={communications || []}
          />
        );
      case 'maintenance':
        return (
          <TenantMaintenanceSection 
            requests={maintenanceRequests || []}
            tenantId={tenant.id}
            onMaintenanceUpdate={refreshDashboard}
          />
        );
      case 'documents':
        return (
          <TenantDocumentsSection 
            documents={documents || []}
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
            maintenanceRequests={maintenanceRequests || []}
            communications={communications || []}
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
