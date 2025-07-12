
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
      className="space-y-6 mobile-px-2"
    >
      <div className="bg-gradient-to-br from-green-50/50 via-card to-blue-50/50 dark:from-green-950/20 dark:via-card dark:to-blue-950/20 rounded-2xl p-4 md:p-6 border border-border shadow-sm mobile-card-hover">
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
