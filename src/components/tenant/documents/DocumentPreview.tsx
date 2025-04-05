
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, Edit, Check } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  useEffect(() => {
    console.log("TenantDocumentPreview: Preview modal displayed:", showPreview);
    console.log("TenantDocumentPreview: Is editing mode:", isEditing);
    console.log("TenantDocumentPreview: PDF URL available:", !!generatedPdfUrl);
    if (generatedPdfUrl) {
      console.log("TenantDocumentPreview: PDF URL starts with:", generatedPdfUrl.substring(0, 30) + "...");
    }
  }, [showPreview, isEditing, generatedPdfUrl]);

  // Add an onLoad handler for the iframe to check its background
  useEffect(() => {
    if (!showPreview || isEditing || !generatedPdfUrl || !iframeRef.current) return;
    
    const timer = setTimeout(() => {
      if (iframeRef.current) {
        try {
          console.log("TenantDocumentPreview: Iframe loaded, checking styles");
          console.log("TenantDocumentPreview: Iframe style:", 
            window.getComputedStyle(iframeRef.current).backgroundColor);
        } catch (e) {
          console.log("TenantDocumentPreview: Error accessing iframe:", e);
        }
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [showPreview, isEditing, generatedPdfUrl]);

  const handleDownload = async () => {
    console.log("TenantDocumentPreview: Starting download");
    await onDownload();
    setShowPreview(false);
    console.log("TenantDocumentPreview: Download completed");
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
              <Textarea
                value={editedContent}
                onChange={(e) => onEditContent(e.target.value)}
                className="h-full"
                style={{ backgroundColor: "#ffffff" }}
              />
            </div>
          ) : (
            <div className="flex-1 min-h-0 bg-white">
              {generatedPdfUrl && (
                <object
                  data={generatedPdfUrl}
                  type="application/pdf"
                  className="w-full h-full rounded-md border pdf-viewer"
                  style={{ backgroundColor: "#ffffff" }}
                >
                  <iframe
                    ref={iframeRef}
                    src={generatedPdfUrl}
                    className="w-full h-full rounded-md border pdf-viewer"
                    title="PDF Preview"
                    style={{ backgroundColor: "#ffffff" }}
                    onLoad={() => {
                      console.log("TenantDocumentPreview: Iframe onLoad event fired");
                      if (iframeRef.current) {
                        console.log("TenantDocumentPreview: Iframe style:", 
                          window.getComputedStyle(iframeRef.current).backgroundColor);
                      }
                    }}
                  />
                </object>
              )}
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            {isEditing ? (
              <Button onClick={handleSaveEdit}>
                <Check className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={onEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button onClick={handleDownload}>
                  <Check className="mr-2 h-4 w-4" />
                  Save & Download
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
