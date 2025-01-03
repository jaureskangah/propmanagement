import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
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
          break;
        case "receipt":
          initialContent = `RENT RECEIPT

Tenant: ${tenant.name}
Property: ${tenant.properties?.name || 'Not specified'}
Unit Number: ${tenant.unit_number}
Amount: $${tenant.rent_amount}
Date: ${new Date().toLocaleDateString()}

[Payment details can be edited here]`;
          break;
        case "notice":
          initialContent = `NOTICE TO VACATE

Date: ${new Date().toLocaleDateString()}

To: ${tenant.name}
${tenant.properties?.name || 'Property Address'}
Unit ${tenant.unit_number}

Dear ${tenant.name},

This letter serves as formal notice that you are required to vacate the premises described above. 

Current Lease Details:
- Lease Start Date: ${tenant.lease_start}
- Lease End Date: ${tenant.lease_end}
- Monthly Rent: $${tenant.rent_amount}

Please ensure that:
1. All personal belongings are removed
2. The unit is cleaned thoroughly
3. All keys are returned
4. A forwarding address is provided

[Additional terms and conditions can be edited here]

Sincerely,
Property Management`;
          break;
        default:
          throw new Error("Template not implemented");
      }

      console.log("Generating PDF with content:", initialContent);
      pdfDoc = await generateCustomPdf(initialContent);
      console.log("PDF generated successfully");

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
      const timestamp = new Date().getTime();
      const fileName = selectedTemplate === 'lease' 
        ? `contrat_location_${tenant.name.toLowerCase().replace(/\s+/g, '_')}_${timestamp}.pdf`
        : `recu_loyer_${tenant.name.toLowerCase().replace(/\s+/g, '_')}_${timestamp}.pdf`;

      const response = await fetch(generatedPdfUrl);
      const blob = await response.blob();
      const file = new File([blob], fileName, { type: 'application/pdf' });

      const filePath = `${tenant.id}/${fileName}`;
      console.log("Uploading file to path:", filePath);

      const { error: uploadError, data } = await supabase.storage
        .from('tenant_documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true // Changed to true to handle duplicate files
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log("File uploaded successfully, getting public URL");
      const { data: { publicUrl } } = supabase.storage
        .from('tenant_documents')
        .getPublicUrl(filePath);

      console.log("Public URL generated:", publicUrl);

      const { error: dbError } = await supabase
        .from('tenant_documents')
        .insert({
          tenant_id: tenant.id,
          name: fileName,
          file_url: publicUrl
        });

      if (dbError) {
        console.error('Database error:', dbError);
        throw dbError;
      }

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