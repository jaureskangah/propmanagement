
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
  
  // Assurons-nous que l'URL du document est disponible
  const ensureFileUrl = (doc: TenantDocument): string => {
    if (doc.file_url) return doc.file_url;
    
    // Génération d'une URL directe si elle n'existe pas
    return `https://jhjhzwbvmkurwfohjxlu.supabase.co/storage/v1/object/public/tenant_documents/${doc.tenant_id || ''}/${doc.name}`;
  };
  
  const handleDownload = async () => {
    console.log("Download button clicked in DocumentViewerHeader");
    console.log("Document:", document);
    
    const fileUrl = ensureFileUrl(document);
    console.log("Document URL (ensured):", fileUrl);
    
    const result = await downloadDocument(fileUrl, document.name || 'document', t);
    toast(result);
  };
  
  const handleOpenInNewTab = () => {
    console.log("Open in new tab button clicked in DocumentViewerHeader");
    console.log("Document:", document);
    
    const fileUrl = ensureFileUrl(document);
    console.log("Document URL (ensured):", fileUrl);
    
    const result = openDocumentInNewTab(fileUrl, t);
    toast(result);
  };

  return (
    <DialogHeader className="p-4 border-b">
      <div className="flex items-center justify-between">
        <DialogTitle>{document?.name}</DialogTitle>
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
