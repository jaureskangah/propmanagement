
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Loader2, Download, Save, AlertTriangle } from "lucide-react";

interface DocumentPreviewProps {
  previewUrl: string | null;
  isGenerating: boolean;
  documentContent: string;
  templateName: string;
}

export function DocumentPreview({
  previewUrl,
  isGenerating,
  documentContent,
  templateName
}: DocumentPreviewProps) {
  const { t } = useLocale();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    if (!previewUrl) return;
    
    setIsDownloading(true);
    
    // Here we would normally convert the content to a PDF
    // For demo purposes, we'll simulate a download delay
    setTimeout(() => {
      // Create a link element to trigger the download
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
    }, 1000);
  };

  const handleSaveToSystem = () => {
    if (!documentContent) return;
    
    setIsSaving(true);
    
    // Simulate saving to system with a delay
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: t('documentSaved'),
        description: t('documentSavedDescription')
      });
    }, 1500);
  };

  // Show loading state
  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] border border-dashed rounded-md p-4">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground text-center">
          {t('generatingPreview')}
        </p>
      </div>
    );
  }

  // Show empty state when no preview is available
  if (!previewUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] border border-dashed rounded-md p-4">
        <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">{t('noPreviewAvailable')}</h3>
        <p className="text-muted-foreground text-center max-w-md">
          {t('generatePreviewDescription')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-md h-[500px] overflow-auto bg-white">
        <iframe
          src={previewUrl}
          title="Document Preview"
          className="w-full h-full"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={handleSaveToSystem}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('saving')}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {t('saveDocument')}
            </>
          )}
        </Button>
        <Button onClick={handleDownload} disabled={isDownloading}>
          {isDownloading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('downloading')}
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              {t('downloadDocument')}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
