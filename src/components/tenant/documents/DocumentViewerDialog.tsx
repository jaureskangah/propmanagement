
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
import { Download, Share2, X } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

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
      setViewUrl(document.file_url);
      
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

  const handleDownload = () => {
    if (!document?.file_url) return;
    
    // Créer un élément de lien temporaire
    const link = window.document.createElement('a');
    link.href = document.file_url;
    link.download = document.name || 'document';
    
    // Ajouter au document, cliquer, puis supprimer
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
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
              <iframe 
                src={`${viewUrl}#toolbar=0&navpanes=0&scrollbar=0`} 
                className="w-full h-full border-none"
                title={document.name}
              />
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
                  onClick={handleDownload}
                >
                  {t("downloadDocument") || "Télécharger le document"}
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
