
import React, { useEffect, useState } from "react";
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
  
  const [dialogHeight, setDialogHeight] = useState("80vh");
  const [contentHeight, setContentHeight] = useState("0px");
  
  // Log when component mounts or updates
  useEffect(() => {
    console.log("TenantDocumentPreview: Preview modal displayed:", showPreview);
    console.log("TenantDocumentPreview: Is editing mode:", isEditing);
    console.log("TenantDocumentPreview: PDF URL available:", !!generatedPdfUrl);
    console.log("TenantDocumentPreview: Dialog dimensions:", { dialogHeight, contentHeight });
    
    if (generatedPdfUrl) {
      console.log("TenantDocumentPreview: PDF URL starts with:", generatedPdfUrl.substring(0, 30) + "...");
    }
  }, [showPreview, isEditing, generatedPdfUrl, dialogHeight, contentHeight]);

  // Set content height when dialog is shown
  useEffect(() => {
    if (showPreview) {
      // Reserve space for header and buttons (adjust as needed)
      const headerHeight = 60; // Approximate header height
      const buttonsHeight = 60; // Approximate buttons section height
      const spacing = 32; // Account for padding/margins
      
      const availableHeight = parseInt(dialogHeight) - headerHeight - buttonsHeight - spacing;
      setContentHeight(`${availableHeight}px`);
      
      console.log("TenantDocumentPreview: Calculated content height:", `${availableHeight}px`);
    }
  }, [showPreview, dialogHeight]);

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
      <DialogContent className="max-w-4xl" style={{ height: dialogHeight }}>
        <DialogHeader>
          <DialogTitle>Document Preview</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col h-full space-y-4">
          <div 
            className="flex-1 min-h-0" 
            style={{ height: contentHeight }}
          >
            {isEditing ? (
              <EditContent 
                editedContent={editedContent} 
                onEditContent={onEditContent} 
              />
            ) : (
              generatedPdfUrl && (
                loadError ? (
                  <ErrorState
                    onRetry={handleRetryLoad}
                  />
                ) : (
                  <PdfViewer
                    pdfUrl={generatedPdfUrl}
                    onError={() => {
                      console.log("TenantDocumentPreview: PdfViewer reported error");
                      setLoadError(true);
                    }}
                  />
                )
              )
            )}
          </div>
          
          <div className="mt-auto">
            <ActionButtons
              isEditing={isEditing}
              onClose={() => {
                console.log("TenantDocumentPreview: Closing preview");
                setShowPreview(false);
              }}
              onEdit={() => {
                console.log("TenantDocumentPreview: Entering edit mode");
                onEdit();
              }}
              onSaveEdit={handleSaveEdit}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
