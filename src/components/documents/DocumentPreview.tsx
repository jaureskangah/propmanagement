
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
  Share2, 
  RefreshCw
} from "lucide-react";

interface DocumentPreviewProps {
  previewUrl: string | null;
  isGenerating: boolean;
  documentContent: string;
  templateName: string;
  onShare?: () => void;
  previewError?: string | null;
}

export function DocumentPreview({
  previewUrl,
  isGenerating,
  documentContent,
  templateName,
  onShare,
  previewError
}: DocumentPreviewProps) {
  const { t } = useLocale();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [loadError, setLoadError] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const objectRef = useRef<HTMLObjectElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Reset error states when props change
  useEffect(() => {
    if (previewUrl) {
      setLoadError(false);
    }
    
    console.log("DocumentPreview: previewUrl updated:", previewUrl ? previewUrl.substring(0, 30) + "..." : "null");
    console.log("DocumentPreview: previewError:", previewError);
  }, [previewUrl, previewError]);
  
  // Add an effect to enforce white background
  useEffect(() => {
    if (containerRef.current) {
      console.log("DocumentPreview: Enforcing white background on container");
      containerRef.current.style.backgroundColor = "#ffffff";
    }

    if (!isGenerating && !previewError && previewUrl) {
      console.log("DocumentPreview: Applying PDF styles");
      
      // Give time for the iframe/object to load
      const timer = setTimeout(() => {
        try {
          if (objectRef.current) {
            objectRef.current.style.backgroundColor = "#ffffff !important";
            console.log("DocumentPreview: Applied white background to object element");
          }
          
          // Try to apply styles directly if same-origin
          if (iframeRef.current) {
            iframeRef.current.style.backgroundColor = "#ffffff !important";
            console.log("DocumentPreview: Applied background to iframe");
            try {
              const iframeDoc = iframeRef.current.contentDocument || 
                (iframeRef.current.contentWindow && iframeRef.current.contentWindow.document);
                
              if (iframeDoc && iframeDoc.body) {
                iframeDoc.body.style.backgroundColor = "#ffffff !important";
                console.log("DocumentPreview: Applied white background to iframe body");
              }
            } catch (e) {
              console.log("DocumentPreview: Cannot access iframe content:", e);
            }
          }
        } catch (e) {
          console.log("DocumentPreview: Error styling PDF elements:", e);
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [previewUrl, isGenerating, previewError]);

  const handleDownload = () => {
    if (!previewUrl) return;
    
    console.log("DocumentPreview: Starting download process");
    setIsDownloading(true);
    
    try {
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
    } catch (error) {
      console.error("DocumentPreview: Download error:", error);
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

  const handleRetryLoad = () => {
    setLoadError(false);
    if (previewUrl) {
      console.log("DocumentPreview: Retrying load of preview");
      // Force reload by clearing and resetting URL with a small delay
      const currentUrl = previewUrl;
      setPreviewUrl(null);
      setTimeout(() => setPreviewUrl(currentUrl), 100);
    }
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

  // Show error state from parent component
  if (previewError) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] border border-dashed rounded-md p-4 bg-background dark:bg-gray-800">
        <div className="bg-red-100 p-4 rounded-full mb-4 dark:bg-red-900/30">
          <AlertTriangle className="h-12 w-12 text-red-500" />
        </div>
        <h3 className="text-lg font-medium mb-2">Erreur de génération</h3>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          {previewError}
        </p>
        <Button 
          onClick={handleRetryLoad}
          variant="outline"
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Réessayer
        </Button>
      </div>
    );
  }

  // Show load error state
  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] border border-dashed rounded-md p-4 bg-background dark:bg-gray-800">
        <div className="bg-amber-100 p-4 rounded-full mb-4 dark:bg-amber-900/30">
          <AlertTriangle className="h-12 w-12 text-amber-500" />
        </div>
        <h3 className="text-lg font-medium mb-2">Impossible d'afficher le PDF</h3>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          Le document ne peut pas être affiché. Vous pouvez réessayer ou télécharger directement le document.
        </p>
        <div className="flex space-x-3">
          <Button 
            onClick={handleRetryLoad}
            variant="outline"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Réessayer
          </Button>
          <Button 
            onClick={handleDownload}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Download className="mr-2 h-4 w-4" /> Télécharger
          </Button>
        </div>
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

  console.log("DocumentPreview: Rendering document preview with URL:", previewUrl.substring(0, 30) + "...");
  return (
    <div className="space-y-4">
      <div 
        ref={containerRef}
        className="border rounded-md h-[500px] overflow-hidden shadow-sm pdf-frame-container" 
        style={{ 
          backgroundColor: "#ffffff !important",
          position: "relative"
        }}
      >
        {/* Use both object and iframe for maximum compatibility */}
        <object
          ref={objectRef}
          data={previewUrl}
          type="application/pdf"
          className="w-full h-full pdf-viewer"
          style={{ 
            backgroundColor: "#ffffff !important",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1
          }}
          onError={() => {
            console.log("DocumentPreview: Object error event fired");
            setLoadError(true);
          }}
        >
          <iframe
            ref={iframeRef}
            src={previewUrl}
            title="Document Preview"
            className="w-full h-full pdf-viewer"
            style={{ 
              backgroundColor: "#ffffff !important",
              display: "block",
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%"
            }}
            onError={() => {
              console.log("DocumentPreview: Iframe error event fired");
              setLoadError(true);
            }}
            onLoad={() => {
              console.log("DocumentPreview: Iframe loaded");
              try {
                // Try to access iframe content if same-origin
                if (iframeRef.current && iframeRef.current.contentDocument) {
                  console.log("DocumentPreview: Attempting to style iframe content");
                  const doc = iframeRef.current.contentDocument;
                  if (doc && doc.body) {
                    doc.body.style.backgroundColor = "#ffffff !important";
                    console.log("DocumentPreview: Applied white background to iframe body");
                  }
                }
              } catch (e) {
                console.log("DocumentPreview: Error styling iframe:", e);
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
