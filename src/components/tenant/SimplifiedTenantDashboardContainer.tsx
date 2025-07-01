
import React, { useState, useEffect, useMemo } from "react";
import { TubelightNavBar } from "@/components/ui/tubelight-navbar";
import { Home, Wrench, FileText, Settings, Calendar } from "lucide-react";
import { useSafeTranslation } from "@/hooks/useSafeTranslation";
import { TenantOverview } from "./sections/TenantOverview";
import { TenantMaintenanceSection } from "./sections/TenantMaintenanceSection";
import { TenantDocumentsSection } from "./sections/TenantDocumentsSection";
import { TenantSettingsSection } from "./sections/TenantSettingsSection";
import { TenantLeaseStatusSection } from "./sections/TenantLeaseStatusSection";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { ProgressiveLoader } from "./dashboard/ProgressiveLoader";
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
    return undefined;
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
  const { t } = useSafeTranslation();
  const [activeTab, setActiveTab] = useState(() => {
    try {
      return localStorage.getItem('tenantDashboardActiveTab') || 'overview';
    } catch {
      return 'overview';
    }
  });

  // Save active tab to localStorage with error handling
  useEffect(() => {
    try {
      localStorage.setItem('tenantDashboardActiveTab', activeTab);
    } catch (error) {
      console.warn('Failed to save active tab to localStorage:', error);
    }
  }, [activeTab]);

  // Memoize dynamic counts to prevent recalculations and ensure consistency
  const dynamicCounts = useMemo(() => {
    console.log("=== CALCULATING UNIFIED DYNAMIC COUNTS ===");
    console.log("Maintenance requests:", maintenanceRequests?.length || 0);
    
    try {
      // Overview: Format days left with "j" suffix for active/expiring leases
      const overviewCount = formatDaysCounter(leaseStatus.daysLeft, leaseStatus.status);
      
      // Maintenance: Use centralized calculation for consistency
      const pendingMaintenance = calculatePendingMaintenance(maintenanceRequests || []);
      console.log("Calculated pending maintenance:", pendingMaintenance);
      
      // Documents: Total documents
      const documentsCount = documents?.length || 0;

      // Lease: Show count for expiring status
      const leaseCount = leaseStatus.status === 'expiring' ? leaseStatus.daysLeft : undefined;

      const counts = {
        overview: overviewCount,
        maintenance: pendingMaintenance,
        documents: documentsCount,
        lease: leaseCount,
        settings: undefined
      };
      
      console.log("Final unified counts:", counts);
      return counts;
    } catch (error) {
      console.error("Error calculating dynamic counts:", error);
      return {
        overview: undefined,
        maintenance: 0,
        documents: 0,
        lease: undefined,
        settings: undefined
      };
    }
  }, [leaseStatus.daysLeft, leaseStatus.status, maintenanceRequests, documents]);

  // Memoized function to get contextual count for active tab
  const getCountForTab = useMemo(() => {
    return (tabValue: string) => {
      if (tabValue !== activeTab) {
        return undefined;
      }
      
      switch (tabValue) {
        case 'overview':
          return dynamicCounts.overview;
        case 'maintenance':
          return dynamicCounts.maintenance || undefined;
        case 'documents':
          return dynamicCounts.documents || undefined;
        case 'lease':
          return dynamicCounts.lease || undefined;
        case 'settings':
          return undefined;
        default:
          return undefined;
      }
    };
  }, [activeTab, dynamicCounts]);

  // Show lease tab only if tenant has lease data and status is concerning
  const showLeaseTab = tenant.lease_start && tenant.lease_end && 
                      (leaseStatus.status === 'expiring' || leaseStatus.status === 'expired');

  // Memoized nav items to prevent recreation on every render
  const navItems = useMemo(() => {
    try {
      const baseItems = [
        { 
          name: t('overview', 'Aperçu'), 
          value: "overview", 
          icon: Home,
          count: getCountForTab('overview')
        },
        { 
          name: t('maintenance', 'Maintenance'), 
          value: "maintenance", 
          icon: Wrench,
          count: getCountForTab('maintenance')
        },
        { 
          name: t('documents', 'Documents'), 
          value: "documents", 
          icon: FileText,
          count: getCountForTab('documents')
        },
      ];

      // Add lease tab if needed
      if (showLeaseTab) {
        baseItems.splice(1, 0, {
          name: t('leaseStatus', 'Bail'), 
          value: "lease", 
          icon: Calendar,
          count: getCountForTab('lease')
        });
      }

      // Add settings tab
      baseItems.push({
        name: t('settings', 'Paramètres'), 
        value: "settings", 
        icon: Settings,
        count: getCountForTab('settings')
      });

      return baseItems;
    } catch (error) {
      console.error("Error creating nav items:", error);
      return [
        { name: 'Aperçu', value: "overview", icon: Home, count: undefined },
        { name: 'Maintenance', value: "maintenance", icon: Wrench, count: undefined },
        { name: 'Documents', value: "documents", icon: FileText, count: undefined },
        { name: 'Paramètres', value: "settings", icon: Settings, count: undefined },
      ];
    }
  }, [getCountForTab, t, showLeaseTab]);

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <ErrorBoundary>
            <TenantOverview 
              tenant={tenant}
              leaseStatus={leaseStatus}
              maintenanceRequests={maintenanceRequests || []}
              communications={communications || []}
            />
          </ErrorBoundary>
        );
      case 'maintenance':
        return (
          <ErrorBoundary>
            <TenantMaintenanceSection 
              requests={maintenanceRequests || []}
              tenantId={tenant.id}
              onMaintenanceUpdate={refreshDashboard}
            />
          </ErrorBoundary>
        );
      case 'documents':
        return (
          <ErrorBoundary>
            <TenantDocumentsSection 
              documents={documents || []}
              tenantId={tenant.id}
              onDocumentUpdate={refreshDashboard}
              tenant={tenant}
            />
          </ErrorBoundary>
        );
      case 'lease':
        return (
          <ErrorBoundary>
            <TenantLeaseStatusSection 
              tenant={tenant}
              leaseStatus={leaseStatus}
            />
          </ErrorBoundary>
        );
      case 'settings':
        return (
          <ErrorBoundary>
            <TenantSettingsSection 
              tenant={tenant}
              onSettingsUpdate={refreshDashboard}
            />
          </ErrorBoundary>
        );
      default:
        return (
          <ErrorBoundary>
            <TenantOverview 
              tenant={tenant}
              leaseStatus={leaseStatus}
              maintenanceRequests={maintenanceRequests || []}
              communications={communications || []}
            />
          </ErrorBoundary>
        );
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <ErrorBoundary>
        <TubelightNavBar
          items={navItems}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className="mb-8"
        />
      </ErrorBoundary>

      <ProgressiveLoader delay={100}>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-[500px]"
        >
          {renderActiveSection()}
        </motion.div>
      </ProgressiveLoader>
    </div>
  );
};
