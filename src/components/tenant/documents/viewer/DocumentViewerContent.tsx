import React, { useEffect, useState } from "react";
import { PdfViewer } from "@/components/documents/PdfViewer";
import { Button } from "@/components/ui/button";
import { openDocumentInNewTab, ensureDocumentUrl } from "../utils/documentUtils";
import { TenantDocument } from "@/types/tenant";
import { useToast } from "@/hooks/use-toast";

interface DocumentViewerContentProps {
  document: TenantDocument;
  t: (key: string) => string;
}

export const DocumentViewerContent = ({ document, t }: DocumentViewerContentProps) => {
  const [viewUrl, setViewUrl] = useState<string | null>(null);
  const [isImage, setIsImage] = useState(false);
  const [isPdf, setIsPdf] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    console.log("DocumentViewerContent - Document:", document);
    
    if (document) {
      const fileUrl = ensureDocumentUrl(document);
      
      const urlWithTimestamp = `${fileUrl}${fileUrl.includes('?') ? '&' : '?'}t=${Date.now()}`;
      setViewUrl(urlWithTimestamp);
      
      const name = (document.name || '').toLowerCase();
      setIsImage(!!name.match(/\.(jpg|jpeg|png|gif|webp)$/));
      setIsPdf(name.endsWith('.pdf'));
      setError(null);
      
      console.log("Document URL (ensured):", fileUrl);
      console.log("Is PDF:", name.endsWith('.pdf'));
      console.log("Is Image:", !!name.match(/\.(jpg|jpeg|png|gif|webp)$/));
    } else {
      setViewUrl(null);
      setError(null);
    }
  }, [document]);

  const handleOpenInNewTab = () => {
    console.log("Open in new tab button clicked in DocumentViewerContent");
    console.log("Document object:", document);
    
    const fileUrl = ensureDocumentUrl(document);
    console.log("Document URL (ensured):", fileUrl);
    
    const result = openDocumentInNewTab(fileUrl, t);
    toast(result);
  };

  return (
    <div className="flex-1 overflow-auto bg-slate-100 p-4 flex justify-center">
      {error ? (
        <div className="flex items-center justify-center h-full w-full">
          <p className="text-red-500">{error}</p>
        </div>
      ) : viewUrl ? (
        isPdf ? (
          <PdfViewer url={viewUrl} />
        ) : isImage ? (
          <img 
            src={viewUrl} 
            alt={document.name} 
            className="max-h-full object-contain" 
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full flex-col">
            <p className="text-muted-foreground mb-2">
              {t("previewNotAvailable") || "Aperçu non disponible pour ce type de fichier"}
            </p>
            <Button 
              variant="secondary" 
              onClick={handleOpenInNewTab}
            >
              {t("openDocument") || "Ouvrir le document"}
            </Button>
          </div>
        )
      ) : (
        <div className="flex items-center justify-center h-full w-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
        </div>
      )}
    </div>
  );
};
