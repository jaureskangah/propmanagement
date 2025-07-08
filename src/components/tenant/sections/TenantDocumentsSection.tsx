
import { TenantDocuments } from "../TenantDocuments";
import { motion } from "framer-motion";
import type { TenantDocument } from "@/types/tenant";
import type { TenantData } from "@/hooks/tenant/dashboard/useTenantData";

interface TenantDocumentsSectionProps {
  documents: TenantDocument[];
  tenantId: string;
  onDocumentUpdate: () => void;
  tenant: TenantData;
}

export const TenantDocumentsSection = ({
  documents,
  tenantId,
  onDocumentUpdate,
  tenant
}: TenantDocumentsSectionProps) => {
  // Convert TenantData to format expected by TenantDocuments
  const tenantForDocuments = {
    ...tenant,
    phone: null,
    user_id: '',
    created_at: '',
    updated_at: '',
    tenant_profile_id: null,
    documents: [],
    paymentHistory: [],
    maintenanceRequests: [],
    communications: [],
    security_deposit: null,
    notes: null
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-gradient-to-br from-blue-50/50 via-card to-purple-50/50 dark:from-blue-950/20 dark:via-card dark:to-purple-950/20 rounded-2xl p-6 border border-border shadow-sm">
        <TenantDocuments 
          documents={documents}
          tenantId={tenantId}
          onDocumentUpdate={onDocumentUpdate}
          tenant={tenantForDocuments}
        />
      </div>
    </motion.div>
  );
};
