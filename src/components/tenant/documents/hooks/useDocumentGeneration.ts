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
        title: "Erreur",
        description: "Veuillez sélectionner un modèle de document",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      let pdfDoc;
      let fileName;

      switch (selectedTemplate) {
        case "lease":
          pdfDoc = await generateLeaseAgreement(tenant);
          fileName = `contrat_location_${tenant.name.toLowerCase().replace(/\s+/g, '_')}.pdf`;
          break;
        case "receipt":
          pdfDoc = await generateRentalReceipt(tenant);
          fileName = `recu_loyer_${tenant.name.toLowerCase().replace(/\s+/g, '_')}.pdf`;
          break;
        default:
          throw new Error("Modèle non implémenté");
      }

      const pdfBlob = new Blob([pdfDoc], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setGeneratedPdfUrl(pdfUrl);
      setShowPreview(true);

      // Convertir le PDF en texte pour l'édition
      const textContent = await extractTextFromPdf(pdfBlob);
      setEditedContent(textContent);

    } catch (error) {
      console.error('Erreur de génération du document:', error);
      toast({
        title: "Erreur",
        description: "Échec de la génération du document",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const extractTextFromPdf = async (pdfBlob: Blob): Promise<string> => {
    try {
      // Convertir le Blob en texte en utilisant l'encodage UTF-8
      const arrayBuffer = await pdfBlob.arrayBuffer();
      const decoder = new TextDecoder('utf-8');
      const text = decoder.decode(arrayBuffer);
      
      // Nettoyer le texte des caractères non imprimables
      return text.replace(/[^\x20-\x7E\xA0-\xFF]/g, ' ').trim();
    } catch (error) {
      console.error('Erreur lors de l\'extraction du texte:', error);
      return '';
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