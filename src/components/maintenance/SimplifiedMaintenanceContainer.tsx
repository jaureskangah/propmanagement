
import React from "react";
import { TubelightNavBar } from "@/components/ui/tubelight-navbar";
import { motion } from "framer-motion";
import { MaintenanceContainerHeader } from "./container/MaintenanceContainerHeader";
import { MaintenanceSectionRenderer } from "./container/MaintenanceSectionRenderer";
import { MaintenanceErrorBoundary } from "./container/MaintenanceErrorBoundary";
import { useMaintenanceContainerData } from "./container/hooks/useMaintenanceContainerData";
import { useMaintenanceCounts } from "./container/hooks/useMaintenanceCounts";
import { useMaintenanceNavigation } from "./container/hooks/useMaintenanceNavigation";

export const SimplifiedMaintenanceContainer = () => {
  // Fetch all maintenance data
  const maintenanceData = useMaintenanceContainerData();
  
  // Calculate counts based on data
  const { getCountForTab } = useMaintenanceCounts(maintenanceData);
  
  // Handle navigation and UI state
  const { activeTab, setActiveTab, hasError, setHasError, navItems } = useMaintenanceNavigation(getCountForTab);

  if (hasError) {
    return <MaintenanceErrorBoundary />;
  }

  return (
    <div className="space-y-6 font-sans">
      <MaintenanceContainerHeader />

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
        <MaintenanceSectionRenderer 
          activeTab={activeTab} 
          onError={setHasError}
        />
      </motion.div>
    </div>
  );
};
