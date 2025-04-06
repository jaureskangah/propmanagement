
import type { Tenant } from "@/types/tenant";
import { useGenerationDocumentState } from "./useGenerationDocumentState";
import { usePdfActions } from "./usePdfActions";
import { TenantData } from "./useTenantData";

interface UseDocumentGenerationProps {
  tenant: TenantData | null;
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
