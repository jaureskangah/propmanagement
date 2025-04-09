
import React, { useEffect, useState } from "react";
import { PdfViewer } from "@/components/documents/PdfViewer";
import { Button } from "@/components/ui/button";
import { openDocumentInNewTab } from "../utils/documentUtils";
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
    
    if (document?.file_url) {
      // Append a timestamp to prevent caching issues
      const urlWithTimestamp = `${document.file_url}${document.file_url.includes('?') ? '&' : '?'}t=${Date.now()}`;
      setViewUrl(urlWithTimestamp);
      
      const name = (document.name || '').toLowerCase();
      setIsImage(!!name.match(/\.(jpg|jpeg|png|gif|webp)$/));
      setIsPdf(name.endsWith('.pdf'));
      setError(null);
    } else if (document) {
      console.error("Document missing file_url:", document);
      setError("URL du document non disponible");
      setViewUrl(null);
    } else {
      setViewUrl(null);
      setError(null);
    }
  }, [document]);

  const handleOpenInNewTab = () => {
    if (!document.file_url) {
      console.error("Document URL is undefined in DocumentViewerContent handleOpenInNewTab");
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
