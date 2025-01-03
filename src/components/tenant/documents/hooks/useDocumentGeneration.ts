import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { generateCustomPdf } from "../templates/customPdf";
import { generateTemplateContent } from "../templates/templateContent";
import { uploadDocumentToStorage, generateFileName } from "../storage/documentStorage";
import type { Tenant } from "@/types/tenant";

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
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const generateDocument = async () => {
    if (!selectedTemplate) {
      toast({
        title: "Error",
        description: "Please select a document template",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const initialContent = generateTemplateContent(selectedTemplate, tenant);
      console.log("Generating PDF with content:", initialContent);
      const pdfDoc = await generateCustomPdf(initialContent);
      console.log("PDF generated successfully");

      const pdfBlob = new Blob([pdfDoc], { type: 'application/pdf' });
      const fileName = generateFileName(selectedTemplate, tenant);
      const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      setGeneratedPdfUrl(pdfUrl);
      setEditedContent(initialContent);
      setShowPreview(true);
    } catch (error) {
      console.error('Document generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate document",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedPdfUrl || !selectedTemplate) return;

    try {
      const fileName = generateFileName(selectedTemplate, tenant);
      const response = await fetch(generatedPdfUrl);
      const blob = await response.blob();
      const file = new File([blob], fileName, { type: 'application/pdf' });
      const filePath = `${tenant.id}/${fileName}`;

      await uploadDocumentToStorage(file, tenant, filePath);

      toast({
        title: "Succès",
        description: "Document enregistré avec succès",
      });

      cleanup();
      onDocumentGenerated();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du document:', error);
      toast({
        title: "Erreur",
        description: "Échec de la sauvegarde du document",
        variant: "destructive",
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      const pdfDoc = await generateCustomPdf(editedContent);
      const pdfBlob = new Blob([pdfDoc], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      setGeneratedPdfUrl(pdfUrl);
      setIsEditing(false);
      
      toast({
        title: "Succès",
        description: "Document mis à jour avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du document:', error);
      toast({
        title: "Erreur",
        description: "Échec de la mise à jour du document",
        variant: "destructive",
      });
    }
  };

  const cleanup = () => {
    if (generatedPdfUrl) {
      URL.revokeObjectURL(generatedPdfUrl);
    }
    setGeneratedPdfUrl(null);
    setShowPreview(false);
    setSelectedTemplate("");
    setIsEditing(false);
    setEditedContent("");
  };

  return {
    selectedTemplate,
    setSelectedTemplate,
    isGenerating,
    generatedPdfUrl,
    generateDocument,
    handleDownload,
    handleEdit,
    handleSaveEdit,
  };
};