
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/components/providers/LocaleProvider";

export interface UseDocumentPreviewProps {
  previewUrl: string | null;
  documentContent?: string;
  templateName?: string;
}

export function useDocumentPreview({ previewUrl, documentContent, templateName }: UseDocumentPreviewProps) {
  const { t } = useLocale();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  
  // Reset error state when previewUrl changes
  useEffect(() => {
    if (previewUrl) {
      setLoadError(false);
      console.log("useDocumentPreview: Preview URL updated:", previewUrl.substring(0, 30) + "...");
    }
  }, [previewUrl]);

  const handleDownload = () => {
    if (!previewUrl) return;
    
    console.log("useDocumentPreview: Starting download process");
    setIsDownloading(true);
    
    try {
      console.log("useDocumentPreview: Creating download link");
      const link = document.createElement("a");
      link.href = previewUrl;
      link.download = `${templateName || "document"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsDownloading(false);
      toast({
        title: t('downloadStarted'),
        description: t('downloadStartedDescription')
      });
      console.log("useDocumentPreview: Download completed");
    } catch (error) {
      console.error("useDocumentPreview: Download error:", error);
      setIsDownloading(false);
      toast({
        title: "Erreur",
        description: "Échec du téléchargement du document",
        variant: "destructive",
      });
    }
  };

  const handleSaveToSystem = () => {
    if (!documentContent) return;
    
    console.log("useDocumentPreview: Starting save process");
    setIsSaving(true);
    
    // Simulate saving to system with a delay
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: t('documentSaved'),
        description: t('documentSavedDescription')
      });
      console.log("useDocumentPreview: Save completed");
    }, 1500);
  };

  const handleRetryLoad = () => {
    setLoadError(false);
    if (previewUrl) {
      console.log("useDocumentPreview: Retrying load of preview");
      // Force reload by clearing and resetting URL with a small delay
      const currentUrl = previewUrl;
      // We don't have access to setPreviewUrl here, this needs to be handled at the component level
    }
  };

  return {
    isSaving,
    isDownloading,
    loadError,
    setLoadError,
    handleDownload,
    handleSaveToSystem,
    handleRetryLoad
  };
}
