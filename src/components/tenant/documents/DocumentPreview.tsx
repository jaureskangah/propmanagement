
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PdfViewer } from "./preview/PdfViewer";
import { ErrorState } from "./preview/ErrorState";
import { EditContent } from "./preview/EditContent";
import { ActionButtons } from "./preview/ActionButtons";
import { useDocumentPreview } from "./preview/useDocumentPreview";

interface DocumentPreviewProps {
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
  generatedPdfUrl: string | null;
  isEditing: boolean;
  editedContent: string;
  onEditContent: (content: string) => void;
  onEdit: () => void;
  onSaveEdit: () => void;
  onDownload: () => Promise<void>;
}

export const DocumentPreview = ({
  showPreview,
  setShowPreview,
  generatedPdfUrl,
  isEditing,
  editedContent,
  onEditContent,
  onEdit,
  onSaveEdit,
  onDownload,
}: DocumentPreviewProps) => {
  const { loadError, setLoadError, handleRetryLoad } = useDocumentPreview({
    showPreview,
    generatedPdfUrl
  });
  
  // Log when component mounts or updates
  React.useEffect(() => {
    console.log("TenantDocumentPreview: Preview modal displayed:", showPreview);
    console.log("TenantDocumentPreview: Is editing mode:", isEditing);
    console.log("TenantDocumentPreview: PDF URL available:", !!generatedPdfUrl);
    if (generatedPdfUrl) {
      console.log("TenantDocumentPreview: PDF URL starts with:", generatedPdfUrl.substring(0, 30) + "...");
    }
  }, [showPreview, isEditing, generatedPdfUrl]);

  const handleDownload = async () => {
    console.log("TenantDocumentPreview: Starting download");
    try {
      await onDownload();
      setShowPreview(false);
      console.log("TenantDocumentPreview: Download completed");
    } catch (error) {
      console.error("TenantDocumentPreview: Download error:", error);
    }
  };

  const handleSaveEdit = () => {
    console.log("TenantDocumentPreview: Saving edits");
    onSaveEdit();
    setShowPreview(false);
    console.log("TenantDocumentPreview: Edits saved");
  };

  return (
    <Dialog open={showPreview} onOpenChange={setShowPreview}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Document Preview</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col h-full space-y-4">
          {isEditing ? (
            <div className="flex-1 min-h-0">
              <EditContent 
                editedContent={editedContent} 
                onEditContent={onEditContent} 
              />
            </div>
          ) : (
            <div className="flex-1 min-h-0">
              {generatedPdfUrl && (
                <>
                  {loadError ? (
                    <ErrorState
                      onRetry={handleRetryLoad}
                      onDownload={handleDownload}
                    />
                  ) : (
                    <PdfViewer
                      pdfUrl={generatedPdfUrl}
                      onError={() => setLoadError(true)}
                    />
                  )}
                </>
              )}
            </div>
          )}
          <ActionButtons
            isEditing={isEditing}
            onClose={() => setShowPreview(false)}
            onEdit={onEdit}
            onSaveEdit={handleSaveEdit}
            onDownload={handleDownload}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
