
import type { Tenant } from "@/types/tenant";
import { useGenerationDocumentState } from "./useDocumentState";
import { usePdfActions } from "./usePdfActions";

interface UseDocumentGenerationProps {
  tenant: Tenant;
  onDocumentGenerated: () => void;
  setShowPreview: (show: boolean) => void;
  setIsEditing: (editing: boolean) => void;
  editedContent: string;
  setEditedContent: (content: string) => void;
}

export const useDocumentGeneration = ({
  tenant,
  onDocumentGenerated,
  setShowPreview,
  setIsEditing,
  editedContent,
  setEditedContent,
}: UseDocumentGenerationProps) => {
  const {
    selectedTemplate,
    setSelectedTemplate,
    isGenerating,
    setIsGenerating,
    generatedPdfUrl,
    setGeneratedPdfUrl,
    cleanup,
  } = useGenerationDocumentState();

  const {
    generateDocument,
    handleDownload,
    handleEdit,
    handleSaveEdit,
  } = usePdfActions({
    tenant,
    onDocumentGenerated,
    setShowPreview,
    setIsEditing,
    setEditedContent,
    setIsGenerating,
    setGeneratedPdfUrl,
    cleanup,
  });

  return {
    selectedTemplate,
    setSelectedTemplate,
    isGenerating,
    generatedPdfUrl,
    generateDocument: () => generateDocument(selectedTemplate),
    handleDownload: () => handleDownload(generatedPdfUrl!, selectedTemplate),
    handleEdit,
    handleSaveEdit: () => handleSaveEdit(editedContent),
  };
};
