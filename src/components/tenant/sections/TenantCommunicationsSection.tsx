
import { TenantCommunications } from "../TenantCommunications";
import { motion } from "framer-motion";
import type { Communication } from "@/types/tenant";
import type { TenantData } from "@/hooks/tenant/dashboard/useTenantData";

interface TenantCommunicationsSectionProps {
  communications: Communication[];
  tenantId: string;
  onCommunicationUpdate: () => void;
  tenant: TenantData;
}

export const TenantCommunicationsSection = ({
  communications,
  tenantId,
  onCommunicationUpdate,
  tenant
}: TenantCommunicationsSectionProps) => {
  const handleToggleStatus = async (comm: Communication) => {
    // This will be handled by TenantCommunications component
    onCommunicationUpdate();
  };

  const handleDeleteCommunication = async (comm: Communication) => {
    // This will be handled by TenantCommunications component
    onCommunicationUpdate();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-gradient-to-br from-green-50 via-white to-blue-50 rounded-2xl p-6 border border-gray-100 shadow-sm">
        <TenantCommunications 
          communications={communications}
          tenantId={tenantId}
          onCommunicationUpdate={onCommunicationUpdate}
          onToggleStatus={handleToggleStatus}
          onDeleteCommunication={handleDeleteCommunication}
          tenant={tenant}
          isTenant={true}
        />
      </div>
    </motion.div>
  );
};
