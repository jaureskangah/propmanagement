
import { useState, useEffect } from "react";
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
  const [containerHeight, setContainerHeight] = useState("auto");

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

  // Log component lifecycle and state changes
  useEffect(() => {
    console.log("DocumentPreview: Component rendered with state:", {
      isGenerating,
      hasPreviewUrl: !!currentPreviewUrl,
      hasError: !!previewError || loadError,
      containerHeight
    });
  }, [isGenerating, currentPreviewUrl, previewError, loadError, containerHeight]);

  // Update currentPreviewUrl when previewUrl prop changes
  if (previewUrl !== currentPreviewUrl) {
    console.log("DocumentPreview: previewUrl changed", {
      old: currentPreviewUrl?.substring(0, 30),
      new: previewUrl?.substring(0, 30)
    });
    setCurrentPreviewUrl(previewUrl);
  }

  // Fix container height to prevent layout shifts
  useEffect(() => {
    if (!isGenerating && currentPreviewUrl) {
      // Set fixed height for the container to prevent layout shifts
      setContainerHeight("500px");
      console.log("DocumentPreview: Setting fixed container height:", "500px");
    }
  }, [isGenerating, currentPreviewUrl]);

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
    console.log("DocumentPreview: Showing error state from parent");
    return (
      <ErrorState 
        onRetry={onRetry}
        errorMessage={previewError}
      />
    );
  }

  // Show load error state
  if (loadError) {
    console.log("DocumentPreview: Showing load error state");
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
      <div style={{ height: containerHeight }}>
        <PdfViewer 
          pdfUrl={currentPreviewUrl}
          onError={() => {
            console.log("DocumentPreview: PDF viewer reported error");
            setLoadError(true);
          }}
        />
      </div>

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
