
import { useEffect, useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogHeader,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TenantDocument } from "@/types/tenant";
import { Download, Share2, X, ExternalLink } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { PdfViewer } from "@/components/documents/PdfViewer";

interface DocumentViewerDialogProps {
  document: TenantDocument | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DocumentViewerDialog = ({
  document,
  open,
  onOpenChange
}: DocumentViewerDialogProps) => {
  const { t } = useLocale();
  const [viewUrl, setViewUrl] = useState<string | null>(null);
  const [isImage, setIsImage] = useState(false);
  const [isPdf, setIsPdf] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("DocumentViewerDialog - Document:", document);
    
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

  const handleDownload = async () => {
    if (!document || !document.file_url) return;
    
    try {
      // Determine the MIME type based on file extension
      const getContentType = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase() || '';
        const mimeTypes: {[key: string]: string} = {
          'pdf': 'application/pdf',
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'doc': 'application/msword',
        };
        return mimeTypes[extension] || 'application/octet-stream';
      };
      
      // Use direct fetch to get the file with correct content type
      const response = await fetch(document.file_url);
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      
      // Get the file as a blob with the correct MIME type
      const blob = await response.blob();
      const contentType = getContentType(document.name);
      const fileBlob = new Blob([blob], { type: contentType });
      
      // Create a download link and click it
      const downloadUrl = URL.createObjectURL(fileBlob);
      const link = window.document.createElement('a');
      link.href = downloadUrl;
      link.download = document.name;
      window.document.body.appendChild(link);
      link.click();
      
      // Clean up
      window.document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
    } catch (error) {
      console.error("Erreur lors du téléchargement du document:", error);
    }
  };

  const handleOpenInNewTab = () => {
    if (!document?.file_url) return;
    
    // Add timestamp to URL to prevent caching issues
    const urlWithTimestamp = `${document.file_url}${document.file_url.includes('?') ? '&' : '?'}t=${Date.now()}`;
    window.open(urlWithTimestamp, '_blank');
  };

  if (!document) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl h-[80vh] max-h-[800px] flex flex-col p-0 gap-0">
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
                onClick={() => onOpenChange(false)}
                className="text-muted-foreground"
                title={t("closeViewer") || "Fermer"}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
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
        
        <DialogFooter className="p-3 border-t bg-slate-50">
          <div className="flex w-full justify-between">
            <p className="text-sm text-muted-foreground">{document.document_type || 'other'}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1"
              onClick={() => {
                if (document.file_url) {
                  navigator.clipboard.writeText(document.file_url);
                  alert(t("success") || "Lien copié");
                }
              }}
            >
              <Share2 className="h-4 w-4" />
              {t("shareDocument") || "Partager"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
