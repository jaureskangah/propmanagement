
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/components/providers/LocaleProvider";
import { 
  Loader2, 
  Download, 
  Save, 
  AlertTriangle, 
  Check, 
  File, 
  Share2 
} from "lucide-react";

interface DocumentPreviewProps {
  previewUrl: string | null;
  isGenerating: boolean;
  documentContent: string;
  templateName: string;
  onShare?: () => void;
}

export function DocumentPreview({
  previewUrl,
  isGenerating,
  documentContent,
  templateName,
  onShare
}: DocumentPreviewProps) {
  const { t } = useLocale();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Log when the previewUrl changes
  useEffect(() => {
    console.log("DocumentPreview: previewUrl updated:", previewUrl ? previewUrl.substring(0, 30) + "..." : "null");
  }, [previewUrl]);
  
  // Add an onLoad handler for the iframe to check its background
  useEffect(() => {
    const checkIframeBackground = () => {
      if (iframeRef.current) {
        try {
          console.log("Iframe loaded, attempting to access contentDocument...");
          // Try to access iframe content if same origin
          const iframeDoc = iframeRef.current.contentDocument || 
            (iframeRef.current.contentWindow && iframeRef.current.contentWindow.document);
          
          if (iframeDoc) {
            console.log("Iframe body background:", 
              iframeDoc.body ? 
              window.getComputedStyle(iframeDoc.body).backgroundColor : 
              "No body element");
          } else {
            console.log("Cannot access iframe content document - likely due to cross-origin restrictions");
          }
        } catch (e) {
          console.log("Error accessing iframe content:", e);
        }
      }
    };
    
    // Delay check to ensure iframe has loaded
    if (previewUrl) {
      const timer = setTimeout(checkIframeBackground, 1000);
      return () => clearTimeout(timer);
    }
  }, [previewUrl]);

  const handleDownload = () => {
    if (!previewUrl) return;
    
    console.log("DocumentPreview: Starting download process");
    setIsDownloading(true);
    
    // Here we would normally convert the content to a PDF
    // For demo purposes, we'll simulate a download delay
    setTimeout(() => {
      console.log("DocumentPreview: Creating download link");
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
      console.log("DocumentPreview: Download completed");
    }, 1000);
  };

  const handleSaveToSystem = () => {
    if (!documentContent) return;
    
    console.log("DocumentPreview: Starting save process");
    setIsSaving(true);
    
    // Simulate saving to system with a delay
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: t('documentSaved'),
        description: t('documentSavedDescription')
      });
      console.log("DocumentPreview: Save completed");
    }, 1500);
  };

  // Show loading state
  if (isGenerating) {
    console.log("DocumentPreview: Showing loading state");
    return (
      <div className="flex flex-col items-center justify-center h-[500px] border border-dashed rounded-md p-4 bg-background dark:bg-gray-800">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground text-center">
          {t('generatingPreview')}
        </p>
      </div>
    );
  }

  // Show empty state when no preview is available
  if (!previewUrl) {
    console.log("DocumentPreview: Showing empty state");
    return (
      <div className="flex flex-col items-center justify-center h-[500px] border border-dashed rounded-md p-4 bg-background dark:bg-gray-800">
        <div className="bg-muted/30 p-4 rounded-full mb-4">
          <File className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">{t('noPreviewAvailable')}</h3>
        <p className="text-muted-foreground text-center max-w-md">
          {t('generatePreviewDescription')}
        </p>
      </div>
    );
  }

  console.log("DocumentPreview: Rendering document preview");
  return (
    <div className="space-y-4">
      <div 
        className="border rounded-md h-[500px] overflow-hidden shadow-sm" 
        style={{ background: "#ffffff" }}
      >
        <object
          data={previewUrl}
          type="application/pdf"
          className="w-full h-full pdf-viewer"
          style={{ backgroundColor: "#ffffff" }}
        >
          <iframe
            ref={iframeRef}
            src={previewUrl}
            title="Document Preview"
            className="w-full h-full pdf-viewer"
            style={{ 
              backgroundColor: "#ffffff",
              display: "block"
            }}
            onLoad={() => {
              console.log("Iframe onLoad event fired");
              if (iframeRef.current) {
                console.log("Iframe element:", iframeRef.current);
                console.log("Iframe style:", window.getComputedStyle(iframeRef.current));
              }
            }}
          />
        </object>
      </div>

      <div className="flex flex-wrap justify-end gap-3">
        <Button
          variant="outline"
          onClick={handleSaveToSystem}
          disabled={isSaving}
          className="bg-blue-100 border-blue-300 hover:bg-blue-200 hover:text-blue-800 text-blue-700 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-800"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('saving')}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
              {t('saveDocument')}
            </>
          )}
        </Button>
        
        {onShare && (
          <Button 
            variant="outline"
            onClick={onShare}
            className="bg-purple-100 border-purple-300 hover:bg-purple-200 hover:text-purple-800 text-purple-700 dark:bg-purple-900 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-800"
          >
            <Share2 className="mr-2 h-4 w-4 text-purple-600 dark:text-purple-400" />
            {t('shareDocument')}
          </Button>
        )}
        
        <Button 
          onClick={handleDownload} 
          disabled={isDownloading}
          className="bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-800"
        >
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

      <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md flex items-start dark:bg-blue-900/30 dark:border-blue-800">
        <div className="mr-2 mt-1">
          <AlertTriangle className="h-5 w-5 text-blue-500 dark:text-blue-400" />
        </div>
        <div>
          <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300">{t('documentTip')}</h4>
          <p className="text-xs text-blue-600 dark:text-blue-400">
            {t('documentTipDescription')}
          </p>
        </div>
      </div>
    </div>
  );
}
