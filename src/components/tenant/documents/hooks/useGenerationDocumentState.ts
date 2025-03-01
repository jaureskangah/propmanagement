
import { useState } from "react";

export const useGenerationDocumentState = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);
  
  const cleanup = () => {
    if (generatedPdfUrl) {
      URL.revokeObjectURL(generatedPdfUrl);
      setGeneratedPdfUrl(null);
    }
    setSelectedTemplate("");
  };

  return {
    selectedTemplate,
    setSelectedTemplate,
    isGenerating,
    setIsGenerating,
    generatedPdfUrl,
    setGeneratedPdfUrl,
    cleanup,
  };
};
