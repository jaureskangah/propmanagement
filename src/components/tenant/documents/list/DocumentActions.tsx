
import { TenantDocument } from "@/types/tenant";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, Trash2 } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { QuickPreview } from "./QuickPreview";
import { useToast } from "@/hooks/use-toast";

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

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!documentItem.file_url) {
      console.error("Document URL is undefined");
      toast({
        title: t("error") || "Error",
        description: t("fileNotFound") || "File not found",
        variant: "destructive",
      });
      return;
    }
    
    // Create a temporary link element
    const link = window.document.createElement('a');
    link.href = documentItem.file_url;
    link.download = documentItem.name || 'document';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    // Append to the document, click it, and remove it
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  const handleOpenInTab = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!documentItem.file_url) {
      console.error("Document URL is undefined");
      toast({
        title: t("error") || "Error",
        description: t("fileNotFound") || "File not found",
        variant: "destructive",
      });
      return;
    }
    
    // Add timestamp to prevent caching issues
    const urlWithTimestamp = `${documentItem.file_url}${documentItem.file_url.includes('?') ? '&' : '?'}t=${Date.now()}`;
    window.open(urlWithTimestamp, '_blank');
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
