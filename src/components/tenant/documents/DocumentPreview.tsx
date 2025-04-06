
import React from "react";
import { Button } from "@/components/ui/button";

interface DocumentPreviewProps {
  pdfUrl: string | null;
  isLoading: boolean;
  onDownload: () => Promise<void>;
}

export const DocumentPreview = ({
  pdfUrl,
  isLoading,
  onDownload,
}: DocumentPreviewProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!pdfUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-muted-foreground mb-4">No preview available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border rounded h-[400px] overflow-hidden">
        <iframe 
          src={pdfUrl}
          className="w-full h-full"
          title="Document Preview"
        />
      </div>
      <div className="flex justify-end">
        <Button onClick={onDownload} className="min-w-[120px]">
          Download
        </Button>
      </div>
    </div>
  );
};
