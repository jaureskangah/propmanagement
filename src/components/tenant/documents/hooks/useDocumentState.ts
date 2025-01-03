import { useState } from "react";

export const useDocumentState = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const cleanup = () => {
    if (generatedPdfUrl) {
      URL.revokeObjectURL(generatedPdfUrl);
    }
    setGeneratedPdfUrl(null);
    setSelectedTemplate("");
    setIsEditing(false);
    setEditedContent("");
  };

  return {
    selectedTemplate,
    setSelectedTemplate,
    isGenerating,
    setIsGenerating,
    generatedPdfUrl,
    setGeneratedPdfUrl,
    editedContent,
    setEditedContent,
    isEditing,
    setIsEditing,
    cleanup,
  };
};