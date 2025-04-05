
import { useState } from "react";

interface UseDocumentPreviewProps {
  showPreview: boolean;
  generatedPdfUrl: string | null;
}

export function useDocumentPreview({ showPreview, generatedPdfUrl }: UseDocumentPreviewProps) {
  const [loadError, setLoadError] = useState(false);

  // Reset error state when dialog opens or URL changes
  if (showPreview && generatedPdfUrl) {
    console.log("useDocumentPreview: Preview URL available, resetting error state");
    if (loadError) {
      setLoadError(false);
    }
  }

  const handleRetryLoad = () => {
    console.log("useDocumentPreview: Retrying load");
    setLoadError(false);
  };

  return {
    loadError,
    setLoadError,
    handleRetryLoad
  };
}
