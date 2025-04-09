
import React from "react";
import { 
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X, ExternalLink } from "lucide-react";
import { TenantDocument } from "@/types/tenant";
import { downloadDocument, openDocumentInNewTab } from "../utils/documentUtils";

interface DocumentViewerHeaderProps {
  document: TenantDocument;
  onClose: () => void;
  t: (key: string) => string;
}

export const DocumentViewerHeader = ({ document, onClose, t }: DocumentViewerHeaderProps) => {
  const handleDownload = () => {
    if (document.file_url) {
      downloadDocument(document.file_url, document.name || 'document', t);
    }
  };
  
  const handleOpenInNewTab = () => {
    if (document.file_url) {
      openDocumentInNewTab(document.file_url);
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
