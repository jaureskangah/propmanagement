
import { FileText } from "lucide-react";
import { DocumentUpload } from "@/components/tenant/DocumentUpload";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Tenant } from "@/types/tenant";

interface UploadTabProps {
  tenant: Tenant | null;
  onDocumentUpdate: () => void;
}

export function UploadTab({ tenant, onDocumentUpdate }: UploadTabProps) {
  const { t } = useLocale();
  
  return (
    <>
      {tenant ? (
        <div className="border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-medium">{t("uploadNewDocument")}</h3>
          </div>
          <DocumentUpload 
            tenantId={tenant.id} 
            onUploadComplete={onDocumentUpdate} 
          />
        </div>
      ) : (
        <div className="border rounded-lg p-6 text-center">
          <p className="text-muted-foreground">
            Tenant profile not found
          </p>
        </div>
      )}
    </>
  );
}
