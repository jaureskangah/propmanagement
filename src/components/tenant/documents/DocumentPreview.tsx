import React from "react";
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
  onDownload: () => void;
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
              />
            </div>
          ) : (
            <div className="flex-1 min-h-0">
              {generatedPdfUrl && (
                <iframe
                  src={generatedPdfUrl}
                  className="w-full h-full rounded-md border"
                  title="PDF Preview"
                />
              )}
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            {isEditing ? (
              <Button onClick={onSaveEdit}>
                <Check className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={onEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button onClick={onDownload}>
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