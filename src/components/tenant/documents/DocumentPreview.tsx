
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Edit, Check, Download, AlertTriangle, RefreshCw } from "lucide-react";
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
  const objectRef = useRef<HTMLObjectElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadError, setLoadError] = useState(false);
  
  // Log when component mounts or updates
  useEffect(() => {
    console.log("TenantDocumentPreview: Preview modal displayed:", showPreview);
    console.log("TenantDocumentPreview: Is editing mode:", isEditing);
    console.log("TenantDocumentPreview: PDF URL available:", !!generatedPdfUrl);
    if (generatedPdfUrl) {
      console.log("TenantDocumentPreview: PDF URL starts with:", generatedPdfUrl.substring(0, 30) + "...");
    }
    
    // Reset error state when dialog opens
    if (showPreview) {
      setLoadError(false);
    }
  }, [showPreview, isEditing, generatedPdfUrl]);

  // Apply white background styles when component mounts
  useEffect(() => {
    if (containerRef.current) {
      console.log("TenantDocumentPreview: Enforcing white background on container");
      containerRef.current.style.backgroundColor = "#ffffff !important";
    }
  }, []);

  // Add an effect to enforce white background on PDF content
  useEffect(() => {
    if (!showPreview || isEditing || !generatedPdfUrl) return;
    
    console.log("TenantDocumentPreview: Preparing to style PDF viewer");
    
    const timer = setTimeout(() => {
      try {
        // Try to apply styles to the iframe content if same-origin
        if (iframeRef.current) {
          iframeRef.current.style.backgroundColor = "#ffffff !important";
          console.log("TenantDocumentPreview: Applied white background to iframe");
          
          try {
            // Try to access iframe content if same-origin
            const iframeDoc = iframeRef.current.contentDocument || 
              (iframeRef.current.contentWindow && iframeRef.current.contentWindow.document);
            
            if (iframeDoc && iframeDoc.body) {
              iframeDoc.body.style.backgroundColor = "#ffffff !important";
              console.log("TenantDocumentPreview: Applied white background to iframe body");
            }
          } catch (e) {
            console.log("TenantDocumentPreview: Cannot access iframe content:", e);
          }
        }
        
        if (objectRef.current) {
          objectRef.current.style.backgroundColor = "#ffffff !important";
          console.log("TenantDocumentPreview: Applied white background to object element");
        }
      } catch (e) {
        console.log("TenantDocumentPreview: Error styling PDF elements:", e);
      }
    }, 500);
    
    return () => clearTimeout(timer);
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

  const handleRetryLoad = () => {
    console.log("TenantDocumentPreview: Retrying load");
    setLoadError(false);
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
            <div 
              ref={containerRef}
              className="flex-1 min-h-0 pdf-frame-container"
              style={{ backgroundColor: "#ffffff !important" }}
            >
              {generatedPdfUrl && (
                <>
                  {loadError ? (
                    <div className="flex flex-col items-center justify-center h-full bg-gray-50 rounded-md border border-gray-200">
                      <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
                      <h3 className="text-lg font-medium mb-2">Impossible d'afficher le PDF</h3>
                      <p className="text-sm text-gray-500 text-center mb-4 max-w-md">
                        Le document ne peut pas être affiché. Vous pouvez réessayer ou le télécharger directement.
                      </p>
                      <div className="flex gap-3">
                        <Button 
                          onClick={handleRetryLoad}
                          variant="outline"
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Réessayer
                        </Button>
                        <Button 
                          onClick={handleDownload}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Télécharger le document
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <object
                      ref={objectRef}
                      data={generatedPdfUrl}
                      type="application/pdf"
                      className="w-full h-full rounded-md border pdf-viewer"
                      style={{ backgroundColor: "#ffffff !important" }}
                      onError={() => {
                        console.log("TenantDocumentPreview: Object error event fired");
                        setLoadError(true);
                      }}
                    >
                      <iframe
                        ref={iframeRef}
                        src={generatedPdfUrl}
                        className="w-full h-full rounded-md border pdf-viewer"
                        title="PDF Preview"
                        style={{ backgroundColor: "#ffffff !important" }}
                        onError={() => {
                          console.log("TenantDocumentPreview: Iframe error event fired");
                          setLoadError(true);
                        }}
                        onLoad={() => {
                          console.log("TenantDocumentPreview: Iframe onLoad event fired");
                          try {
                            if (iframeRef.current && iframeRef.current.contentDocument) {
                              iframeRef.current.contentDocument.body.style.backgroundColor = "#ffffff !important";
                              console.log("TenantDocumentPreview: Applied white background to iframe content");
                            }
                          } catch (e) {
                            console.log("TenantDocumentPreview: Cannot access iframe content:", e);
                          }
                        }}
                      />
                    </object>
                  )}
                </>
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
                  <Download className="mr-2 h-4 w-4" />
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
