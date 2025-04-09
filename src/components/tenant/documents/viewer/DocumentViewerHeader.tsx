
import React from "react";
import { 
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X, ExternalLink } from "lucide-react";
import { TenantDocument } from "@/types/tenant";
import { downloadDocument, openDocumentInNewTab } from "../utils/documentUtils";
import { useToast } from "@/hooks/use-toast";

interface DocumentViewerHeaderProps {
  document: TenantDocument;
  onClose: () => void;
  t: (key: string) => string;
}

export const DocumentViewerHeader = ({ document, onClose, t }: DocumentViewerHeaderProps) => {
  const { toast } = useToast();
  
  const handleDownload = async () => {
    console.log("Download button clicked. Document URL:", document.file_url);
    if (!document.file_url) {
      console.error("Document URL is undefined in handleDownload");
      toast({
        title: t("error") || "Error",
        description: t("fileNotFound") || "File not found",
        variant: "destructive",
      });
      return;
    }
    
    const result = await downloadDocument(document.file_url, document.name || 'document', t);
    if (result) {
      toast(result);
    }
  };
  
  const handleOpenInNewTab = () => {
    console.log("Open in new tab button clicked. Document URL:", document.file_url);
    if (!document.file_url) {
      console.error("Document URL is undefined in handleOpenInNewTab");
      toast({
        title: t("error") || "Error",
        description: t("fileNotFound") || "File not found",
        variant: "destructive",
      });
      return;
    }
    
    const result = openDocumentInNewTab(document.file_url, t);
    if (result) {
      toast(result);
    }
  };

  return (
    <DialogHeader className="p-4 border-b">
      <div className="flex items-center justify-between">
        <DialogTitle>{document.name}</DialogTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDownload}
            title={t("downloadDocument") || "Télécharger"}
          >
            <Download className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleOpenInNewTab}
            title={t("openInBrowser") || "Ouvrir dans le navigateur"}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground"
            title={t("closeViewer") || "Fermer"}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </DialogHeader>
  );
};
