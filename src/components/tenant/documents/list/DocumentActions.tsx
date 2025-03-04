
import { TenantDocument } from "@/types/tenant";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, Trash2 } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

interface DocumentActionsProps {
  document: TenantDocument;
  onViewDocument: (document: TenantDocument) => void;
  onDeleteDocument: (documentId: string, filename: string) => void;
}

export const DocumentActions = ({ 
  document,
  onViewDocument,
  onDeleteDocument 
}: DocumentActionsProps) => {
  const { t } = useLocale();

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!document.file_url) return;
    
    const link = document.createElement('a');
    link.href = document.file_url;
    link.download = document.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex gap-1 justify-end">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDownload}
        title={t("downloadDocument")}
        className="h-8 w-8"
      >
        <Download className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onViewDocument(document)}
        title={t("openDocument")}
        className="h-8 w-8"
      >
        <ExternalLink className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDeleteDocument(document.id, document.name)}
        title={t("confirmDeleteDocument")}
        className="h-8 w-8 hover:text-red-500"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
