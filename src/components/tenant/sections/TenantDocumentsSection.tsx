
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl p-6 border border-gray-100 shadow-sm">
        <TenantDocuments 
          documents={documents}
          tenantId={tenantId}
          onDocumentUpdate={onDocumentUpdate}
          tenant={tenant}
        />
      </div>
    </motion.div>
  );
};
