
import { TenantDocument } from "@/types/tenant";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, Trash2 } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { QuickPreview } from "./QuickPreview";
import { useToast } from "@/hooks/use-toast";
import { downloadDocument, openDocumentInNewTab } from "../utils/documentUtils";

interface DocumentActionsProps {
  document: TenantDocument;
  onViewDocument: (document: TenantDocument) => void;
  onDeleteDocument: (documentId: string, filename: string) => void;
}

export const DocumentActions = ({ 
  document: documentItem,
  onViewDocument,
  onDeleteDocument 
}: DocumentActionsProps) => {
  const { t } = useLocale();
  const { toast } = useToast();

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    console.log("Download button clicked. Document object:", documentItem);
    console.log("Document URL value:", documentItem?.file_url);
    
    const result = await downloadDocument(documentItem?.file_url, documentItem?.name || 'document', t);
    if (result) {
      toast(result);
    }
  };

  const handleOpenInTab = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    console.log("Open in tab button clicked. Document object:", documentItem);
    console.log("Document URL value:", documentItem?.file_url);
    
    const result = openDocumentInNewTab(documentItem?.file_url, t);
    if (result) {
      toast(result);
    }
  };

  return (
    <div className="flex gap-1 justify-end">
      <QuickPreview 
        document={documentItem} 
        onFullView={() => onViewDocument(documentItem)} 
      />
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
        onClick={handleOpenInTab}
        title={t("openDocument")}
        className="h-8 w-8"
      >
        <ExternalLink className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onDeleteDocument(documentItem.id, documentItem.name);
        }}
        title={t("confirmDeleteDocument")}
        className="h-8 w-8 hover:text-red-500"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
