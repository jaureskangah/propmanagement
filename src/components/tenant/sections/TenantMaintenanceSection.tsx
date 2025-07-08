
import { TenantMaintenance } from "../TenantMaintenance";
import { motion } from "framer-motion";
import type { MaintenanceRequest } from "@/types/tenant";

interface TenantMaintenanceSectionProps {
  requests: MaintenanceRequest[];
  tenantId: string;
  onMaintenanceUpdate: () => void;
}

export const TenantMaintenanceSection = ({
  requests,
  tenantId,
  onMaintenanceUpdate
}: TenantMaintenanceSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-gradient-to-br from-orange-50/50 via-card to-red-50/50 dark:from-orange-950/20 dark:via-card dark:to-red-950/20 rounded-2xl p-6 border border-border shadow-sm">
        <TenantMaintenance 
          requests={requests}
          tenantId={tenantId}
          onMaintenanceUpdate={onMaintenanceUpdate}
        />
      </div>
    </motion.div>
  );
};
