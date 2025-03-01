
import { Download, FileText, X, Share2 } from "lucide-react";
import { TenantDocument } from "@/types/tenant";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useState } from "react";
import { DocumentShare } from "./DocumentShare";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface DocumentViewerProps {
  document: TenantDocument | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DocumentViewerDialog = ({ document, open, onOpenChange }: DocumentViewerProps) => {
  const { t } = useLocale();
  const [isShareOpen, setIsShareOpen] = useState(false);

  const isPdf = document?.name.toLowerCase().endsWith('.pdf');
  const isImage = document?.name.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/);
  const fileUrl = document?.file_url;

  const renderDocumentPreview = () => {
    if (!fileUrl) {
      return (
        <div className="flex items-center justify-center h-96 bg-slate-100 dark:bg-slate-900 rounded">
          <FileText className="h-16 w-16 text-muted-foreground opacity-30" />
        </div>
      );
    }

    if (isPdf) {
      return (
        <iframe
          src={fileUrl}
          className="w-full h-[70vh] rounded border"
          title={document?.name || "Document preview"}
        />
      );
    }

    if (isImage) {
      return (
        <div className="flex items-center justify-center bg-slate-100 dark:bg-slate-900 rounded p-4 h-[70vh]">
          <img
            src={fileUrl}
            alt={document?.name || "Document preview"}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-96 bg-slate-100 dark:bg-slate-900 rounded p-6 text-center">
        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-2">{t("previewNotAvailable")}</p>
        <Button 
          variant="outline" 
          onClick={() => window.open(fileUrl, '_blank')}
          className="mt-4"
        >
          <Download className="h-4 w-4 mr-2" />
          {t("downloadDocument")}
        </Button>
      </div>
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {document?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            {renderDocumentPreview()}
          </div>

          <div className="flex justify-between items-center mt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                if (document?.file_url) {
                  window.open(document.file_url, '_blank');
                }
              }}
              disabled={!document?.file_url}
            >
              <Download className="h-4 w-4 mr-2" />
              {t("downloadDocument")}
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsShareOpen(true)}
              >
                <Share2 className="h-4 w-4 mr-2" />
                {t("shareDocument")}
              </Button>
              
              <DialogClose asChild>
                <Button variant="ghost">
                  <X className="h-4 w-4 mr-2" />
                  {t("closeViewer")}
                </Button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <DocumentShare 
        document={document} 
        open={isShareOpen}
        onOpenChange={setIsShareOpen}
      />
    </>
  );
};
