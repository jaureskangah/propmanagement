
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
      <div className="bg-gradient-to-br from-orange-50 via-white to-red-50 rounded-2xl p-6 border border-gray-100 shadow-sm">
        <TenantMaintenance 
          requests={requests}
          tenantId={tenantId}
          onMaintenanceUpdate={onMaintenanceUpdate}
        />
      </div>
    </motion.div>
  );
};
