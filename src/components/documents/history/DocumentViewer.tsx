
import React from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { DocumentHistoryEntry } from "@/types/documentHistory";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentViewerProps {
  document: DocumentHistoryEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentViewer = ({ document, isOpen, onClose }: DocumentViewerProps) => {
  const { t } = useLocale();
  const { toast } = useToast();
  
  if (!document) return null;
  
  const handleDownload = () => {
    if (document.fileUrl) {
      // Use window.document instead of document to avoid confusion with the parameter name
      const link = window.document.createElement("a");
      link.href = document.fileUrl;
      link.download = `${document.name}.pdf`;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      
      toast({
        title: t('downloadStarted'),
        description: t('downloadStartedDescription')
      });
    }
  };
  
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <AlertDialogHeader>
          <AlertDialogTitle>{document.name}</AlertDialogTitle>
          <AlertDialogDescription>
            {new Date(document.createdAt).toLocaleDateString()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="flex-1 overflow-auto my-4">
          {document.fileUrl ? (
            <iframe 
              src={document.fileUrl}
              className="w-full h-[500px] border-none"
              title={document.name}
            />
          ) : (
            <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md">
              {document.content}
            </div>
          )}
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
          {document.fileUrl && (
            <AlertDialogAction asChild>
              <Button onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                {t('downloadDocument')}
              </Button>
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
