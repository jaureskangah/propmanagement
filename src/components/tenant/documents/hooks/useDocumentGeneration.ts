import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { generateLeaseAgreement } from "../templates/leaseAgreement";
import { generateRentalReceipt } from "../templates/rentalReceipt";
import { generateCustomPdf } from "../templates/customPdf";
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
      let pdfDoc;
      let initialContent = "";

      switch (selectedTemplate) {
        case "lease":
          initialContent = `LEASE AGREEMENT

Tenant: ${tenant.name}
Email: ${tenant.email}
Phone: ${tenant.phone || 'Not provided'}
Property: ${tenant.properties?.name || 'Not specified'}
Unit Number: ${tenant.unit_number}
Start Date: ${tenant.lease_start}
End Date: ${tenant.lease_end}
Monthly Rent: $${tenant.rent_amount}

[The rest of the contract can be edited here]`;
          pdfDoc = await generateCustomPdf(initialContent);
          break;
        case "receipt":
          initialContent = `RENT RECEIPT

Tenant: ${tenant.name}
Property: ${tenant.properties?.name || 'Not specified'}
Unit Number: ${tenant.unit_number}
Amount: $${tenant.rent_amount}
Date: ${new Date().toLocaleDateString()}

[Payment details can be edited here]`;
          pdfDoc = await generateCustomPdf(initialContent);
          break;
        default:
          throw new Error("Template not implemented");
      }

      const pdfBlob = new Blob([pdfDoc], { type: 'application/pdf' });
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
      const fileName = selectedTemplate === 'lease' 
        ? `contrat_location_${tenant.name.toLowerCase().replace(/\s+/g, '_')}.pdf`
        : `recu_loyer_${tenant.name.toLowerCase().replace(/\s+/g, '_')}.pdf`;

      const response = await fetch(generatedPdfUrl);
      const blob = await response.blob();
      const file = new File([blob], fileName, { type: 'application/pdf' });

      const filePath = `${tenant.id}/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from('tenant_documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('tenant_documents')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('tenant_documents')
        .insert({
          tenant_id: tenant.id,
          name: fileName,
          file_url: publicUrl
        });

      if (dbError) throw dbError;

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
