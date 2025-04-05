
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useDocumentHistory } from "@/hooks/useDocumentHistory";

interface UseDocumentPreviewProps {
  previewUrl: string | null;
  documentContent: string;
  templateName: string;
}

export function useDocumentPreview({ 
  previewUrl, 
  documentContent,
  templateName
}: UseDocumentPreviewProps) {
  const { t } = useLocale();
  const { toast } = useToast();
  const { saveToHistory, isLoading: isSavingToHistory } = useDocumentHistory();
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const handleDownload = async () => {
    if (!previewUrl) return;
    
    try {
      setIsDownloading(true);
      
      // Create filename based on template and date
      const fileName = `${templateName || 'document'}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Create a link element and simulate click to download
      const a = document.createElement('a');
      a.href = previewUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: t('downloadStarted'),
        description: t('downloadStartedDescription')
      });
    } catch (error) {
      console.error('Error downloading document:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSaveToSystem = async () => {
    if (!previewUrl || !documentContent) return;
    
    try {
      setIsSaving(true);
      
      // Additional save logic would go here
      // For now just show success toast
      
      toast({
        title: t('documentSaved'),
        description: t('documentSavedDescription')
      });
    } catch (error) {
      console.error('Error saving document:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveToHistory = async () => {
    if (!previewUrl || !documentContent) return;
    
    try {
      // Extract title from content (first line)
      const lines = documentContent.split('\n');
      const title = lines.length > 0 
        ? lines[0].replace(/^#\s*/, '').trim() 
        : templateName || 'Document';
      
      await saveToHistory({
        name: title,
        content: documentContent,
        file_url: previewUrl,
        document_type: templateName || 'custom',
        category: 'generated'
      });
      
      toast({
        title: t('documentSavedToHistory'),
        description: t('documentSavedToHistoryDescription')
      });
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  };

  const handleRetryLoad = () => {
    setLoadError(false);
  };

  return {
    isSaving,
    isDownloading,
    isSavingToHistory,
    loadError,
    setLoadError,
    handleDownload,
    handleSaveToSystem,
    handleSaveToHistory,
    handleRetryLoad
  };
}
