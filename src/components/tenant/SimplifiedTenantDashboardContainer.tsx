
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from "framer-motion";
import { TenantOverview } from './sections/TenantOverview';
import { TenantMaintenanceSection } from './sections/TenantMaintenanceSection';
import { TenantDocumentsSection } from './sections/TenantDocumentsSection';
import { TenantSettingsSection } from './sections/TenantSettingsSection';
import { TenantDashboardNav } from './dashboard/TenantDashboardNav';
import type { TenantData } from '@/hooks/tenant/dashboard/useTenantData';
import type { Communication, MaintenanceRequest, TenantDocument } from '@/types/tenant';

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
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState(() => {
    return searchParams.get('section') || 'overview';
  });

  // Update active section when URL parameters change
  useEffect(() => {
    const section = searchParams.get('section') || 'overview';
    setActiveSection(section);
  }, [searchParams]);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
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
    <div className="space-y-6">
      <TenantDashboardNav onSectionChange={handleSectionChange} />
      
      <motion.div
        key={activeSection}
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
