
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TenantDocument } from "@/types/tenant";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Download, Share, X, ExternalLink } from "lucide-react";

interface DocumentViewerDialogProps {
  document: TenantDocument | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DocumentViewerDialog = ({
  document,
  open,
  onOpenChange,
}: DocumentViewerDialogProps) => {
  const { t } = useLocale();

  const handleDownload = () => {
    if (document?.file_url) {
      // Create a temporary anchor element for download
      const link = document.createElement('a');
      link.href = document.file_url;
      link.setAttribute('download', document.name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const isImage = (filename: string): boolean => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(filename);
  };

  const isPdf = (filename: string): boolean => {
    return /\.pdf$/i.test(filename);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[80vh] p-1 sm:p-4 overflow-hidden flex flex-col">
        <DialogHeader className="px-4 py-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="truncate max-w-[70%]">
              {document?.name}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                asChild
              >
                <a href={document?.file_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        <div className="flex-1 mt-2 bg-slate-100 dark:bg-slate-900 rounded-md overflow-hidden">
          {document && document.file_url && (
            isPdf(document.name) ? (
              <iframe
                src={document.file_url}
                className="w-full h-full rounded border-0"
                title={document.name}
              />
            ) : isImage(document.name) ? (
              <div className="w-full h-full flex items-center justify-center bg-checkerboard">
                <img
                  src={document.file_url}
                  alt={document.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center p-4">
                <a
                  href={document.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-2"
                >
                  <ExternalLink className="h-5 w-5" />
                  {t("openDocument")}
                </a>
              </div>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
