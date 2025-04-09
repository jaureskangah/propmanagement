
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
      try {
        const processedDoc = ensureDocumentUrl(document);
        const fileUrl = processedDoc.file_url || '';
        
        if (!fileUrl) {
          setError(t("fileNotFound") || "Fichier introuvable");
          return;
        }
        
        console.log("Document URL (ensured):", fileUrl);
        setViewUrl(fileUrl);
        
        const name = (document.name || '').toLowerCase();
        setIsImage(!!name.match(/\.(jpg|jpeg|png|gif|webp)$/));
        setIsPdf(name.endsWith('.pdf'));
        setError(null);
        
        console.log("Is PDF:", name.endsWith('.pdf'));
        console.log("Is Image:", !!name.match(/\.(jpg|jpeg|png|gif|webp)$/));
      } catch (err) {
        console.error("Erreur lors du traitement du document:", err);
        setError(t("errorProcessingDocument") || "Erreur lors du traitement du document");
        setViewUrl(null);
      }
    } else {
      setViewUrl(null);
      setError(null);
    }
  }, [document, t]);

  const handleOpenInNewTab = () => {
    console.log("Open in new tab button clicked in DocumentViewerContent");
    console.log("Document object:", document);
    
    if (!document.file_url) {
      const processedDoc = ensureDocumentUrl(document);
      console.log("Document URL (ensured):", processedDoc.file_url);
      
      if (processedDoc.file_url) {
        const result = openDocumentInNewTab(processedDoc.file_url, t);
        toast(result);
      } else {
        toast({
          title: t("error") || "Erreur",
          description: t("fileNotFound") || "Fichier introuvable",
          variant: "destructive",
        });
      }
    } else {
      const result = openDocumentInNewTab(document.file_url, t);
      toast(result);
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-white p-4 flex justify-center">
      {error ? (
        <div className="flex items-center justify-center h-full w-full flex-col bg-white">
          <p className="text-red-500 mb-4">{error}</p>
          <Button 
            variant="secondary" 
            onClick={handleOpenInNewTab}
          >
            {t("openDocument") || "Ouvrir le document dans le navigateur"}
          </Button>
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
          <div className="flex items-center justify-center h-full w-full flex-col bg-white">
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
        <div className="flex items-center justify-center h-full w-full bg-white">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
        </div>
      )}
    </div>
  );
};
