
import { useLocale } from "@/components/providers/LocaleProvider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "./preview/EmptyState";
import { ErrorState } from "./preview/ErrorState";
import { LoadingState } from "./preview/LoadingState";
import { PdfViewer } from "./preview/PdfViewer";
import { ActionButtons } from "./preview/ActionButtons";
import { useState } from "react";
import { ShareDocumentDialog } from "./editor/ShareDocumentDialog";
import { useDocumentPreview } from "./preview/useDocumentPreview";

interface DocumentPreviewProps {
  previewUrl: string | null;
  isGenerating: boolean;
  documentContent: string;
  templateName: string;
  onShare: () => void;
  previewError: string | null;
  onDownload?: () => void;
}

export function DocumentPreview({ 
  previewUrl, 
  isGenerating, 
  documentContent, 
  templateName,
  onShare,
  previewError,
  onDownload
}: DocumentPreviewProps) {
  const { t } = useLocale();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const { isDownloading } = useDocumentPreview({ previewUrl, documentContent, templateName });
  
  const handleShare = () => {
    setShareDialogOpen(true);
  };
  
  return (
    <div className="flex flex-col h-full min-h-[500px] gap-4">
      <div className="flex justify-between items-center mb-2">
        {/* Retrait du titre "Aperçu" */}
        <div></div>
        <ActionButtons 
          onShare={handleShare}
          isDownloading={isDownloading}
        />
      </div>
      
      <Card className="flex-1 overflow-hidden p-0 relative bg-white border document-preview-container" 
        style={{ backgroundColor: "#ffffff" }}
        data-pdf-container="true">
        {isGenerating ? (
          <LoadingState />
        ) : previewError ? (
          <ErrorState 
            onRetry={() => {}} 
            errorMessage={previewError} 
          />
        ) : previewUrl ? (
          <div className="w-full h-full" style={{ backgroundColor: "#ffffff", minHeight: "500px" }}>
            <PdfViewer 
              pdfUrl={previewUrl} 
              onError={() => {
                console.log("DocumentPreview: PdfViewer error event fired");
              }} 
            />
          </div>
        ) : (
          <EmptyState />
        )}
      </Card>
      
      <ShareDocumentDialog 
        isOpen={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        content={documentContent}
        templateName={templateName}
      />
    </div>
  );
}
