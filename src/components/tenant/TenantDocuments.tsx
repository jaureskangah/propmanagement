
import React from "react";
import { DocumentsCard } from "./documents/DocumentsCard";
import type { TenantDocument, Tenant } from "@/types/tenant";

interface TenantDocumentsProps {
  documents: TenantDocument[];
  tenantId: string;
  onDocumentUpdate: () => void;
  tenant: Tenant;
}

export const TenantDocuments = ({ 
  documents, 
  tenantId,
  onDocumentUpdate,
  tenant 
}: TenantDocumentsProps) => {
  return (
    <div className="space-y-6">
      <DocumentsCard 
        documents={documents} 
        tenantId={tenantId} 
        onDocumentUpdate={onDocumentUpdate} 
      />
    </div>
  );
};
