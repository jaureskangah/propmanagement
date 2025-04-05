
import { useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { EmptyState } from "./preview/EmptyState";
import { LoadingState } from "./preview/LoadingState";
import { ErrorState } from "./preview/ErrorState";
import { PdfViewer } from "./preview/PdfViewer";
import { ActionButtons } from "./preview/ActionButtons";
import { DocumentTip } from "./preview/DocumentTip";
import { useDocumentPreview } from "./preview/useDocumentPreview";

interface DocumentPreviewProps {
  previewUrl: string | null;
  isGenerating: boolean;
  documentContent: string;
  templateName: string;
  onShare?: () => void;
  previewError?: string | null;
}

export function DocumentPreview({
  previewUrl,
  isGenerating,
  documentContent,
  templateName,
  onShare,
  previewError
}: DocumentPreviewProps) {
  const { t } = useLocale();
  const [currentPreviewUrl, setCurrentPreviewUrl] = useState(previewUrl);

  const {
    isSaving,
    isDownloading,
    loadError,
    setLoadError,
    handleDownload,
    handleSaveToSystem,
    handleRetryLoad
  } = useDocumentPreview({ 
    previewUrl: currentPreviewUrl,
    documentContent,
    templateName
  });

  // Update currentPreviewUrl when previewUrl prop changes
  if (previewUrl !== currentPreviewUrl) {
    setCurrentPreviewUrl(previewUrl);
  }

  // Handle retry by resetting the preview URL
  const onRetry = () => {
    if (previewUrl) {
      const currentUrl = previewUrl;
      setCurrentPreviewUrl(null);
      setTimeout(() => setCurrentPreviewUrl(currentUrl), 100);
    }
    handleRetryLoad();
  };
  
  // Show loading state
  if (isGenerating) {
    console.log("DocumentPreview: Showing loading state");
    return <LoadingState />;
  }

  // Show error state from parent component
  if (previewError) {
    return (
      <ErrorState 
        onRetry={onRetry}
        errorMessage={previewError}
      />
    );
  }

  // Show load error state
  if (loadError) {
    return (
      <ErrorState 
        onRetry={onRetry}
        onDownload={handleDownload}
      />
    );
  }

  // Show empty state when no preview is available
  if (!currentPreviewUrl) {
    console.log("DocumentPreview: Showing empty state");
    return <EmptyState />;
  }

  console.log("DocumentPreview: Rendering document preview with URL:", currentPreviewUrl.substring(0, 30) + "...");
  
  return (
    <div className="space-y-4">
      <PdfViewer 
        pdfUrl={currentPreviewUrl}
        onError={() => setLoadError(true)}
      />

      <ActionButtons
        onSave={handleSaveToSystem}
        onDownload={handleDownload}
        onShare={onShare}
        isSaving={isSaving}
        isDownloading={isDownloading}
      />

      <DocumentTip />
    </div>
  );
}
