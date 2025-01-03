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
      
      // Générer le PDF et obtenir l'ArrayBuffer
      const pdfBuffer = await generateCustomPdf(initialContent);
      console.log("PDF buffer generated successfully");

      // Créer un Blob à partir de l'ArrayBuffer
      const pdfBlob = new Blob([pdfBuffer], { type: 'application/pdf' });
      const fileName = generateFileName(selectedTemplate, tenant);
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
      
      await uploadDocumentToStorage(blob, tenant, `${tenant.id}/${fileName}`);

      toast({
        title: "Success",
        description: "Document saved successfully",
      });

      cleanup();
      onDocumentGenerated();
    } catch (error) {
      console.error('Error saving document:', error);
      toast({
        title: "Error",
        description: "Failed to save document",
        variant: "destructive",
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      const pdfBuffer = await generateCustomPdf(editedContent);
      const pdfBlob = new Blob([pdfBuffer], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      setGeneratedPdfUrl(pdfUrl);
      setIsEditing(false);
      
      toast({
        title: "Success",
        description: "Document updated successfully",
      });
    } catch (error) {
      console.error('Error updating document:', error);
      toast({
        title: "Error",
        description: "Failed to update document",
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