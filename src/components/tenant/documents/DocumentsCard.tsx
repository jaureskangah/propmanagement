
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { TenantDocument } from "@/types/tenant";
import { useLocale } from "@/components/providers/LocaleProvider";
import { DocumentList } from "./DocumentList";
import { DocumentUpload } from "../DocumentUpload";
import { useToast } from "@/hooks/use-toast";
import { deleteDocument } from "./utils/documentUtils";

interface DocumentsCardProps {
  documents: TenantDocument[];
  tenantId: string;
  onDocumentUpdate: () => void;
}

export const DocumentsCard = ({ 
  documents, 
  tenantId,
  onDocumentUpdate
}: DocumentsCardProps) => {
  const { t } = useLocale();
  const { toast } = useToast();

  const handleDelete = async (documentId: string, filename: string) => {
    const result = await deleteDocument(documentId, onDocumentUpdate, t);
    toast(result);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg">{t('uploadedDocuments')}</CardTitle>
        </div>
        <DocumentUpload tenantId={tenantId} onUploadComplete={onDocumentUpdate} />
      </CardHeader>
      <CardContent>
        <DocumentList 
          documents={documents} 
          onDocumentUpdate={onDocumentUpdate} 
          onDelete={handleDelete}
        />
      </CardContent>
    </Card>
  );
};
