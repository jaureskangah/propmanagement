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
      const initialContent = getInitialContent(tenant, selectedTemplate);
      console.log("Generating PDF with content:", initialContent);
      
      const pdfDoc = await generateCustomPdf(initialContent);
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
      const fileName = getFileName(tenant.name, selectedTemplate, timestamp);
      const filePath = `${tenant.id}/${fileName}`;
      
      console.log("Starting file upload process for:", fileName);
      const { publicUrl } = await uploadFile(generatedPdfUrl, filePath, fileName);
      
      await saveDocumentReference(tenant.id, fileName, publicUrl);

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
      const pdfDoc = await generateCustomPdf(editedContent);
      const pdfBlob = new Blob([pdfDoc], { type: 'application/pdf' });
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

// Helper functions
const getFileName = (tenantName: string, template: string, timestamp: number): string => {
  const sanitizedName = tenantName.toLowerCase().replace(/\s+/g, '_');
  return template === 'lease'
    ? `contrat_location_${sanitizedName}_${timestamp}.pdf`
    : `recu_loyer_${sanitizedName}_${timestamp}.pdf`;
};

const uploadFile = async (fileUrl: string, filePath: string, fileName: string) => {
  const response = await fetch(fileUrl);
  const blob = await response.blob();
  const file = new File([blob], fileName, { type: 'application/pdf' });

  console.log("Uploading file to path:", filePath);
  const { error: uploadError } = await supabase.storage
    .from('tenant_documents')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (uploadError) {
    console.error('Upload error:', uploadError);
    throw uploadError;
  }

  console.log("File uploaded successfully, getting public URL");
  const { data: { publicUrl } } = supabase.storage
    .from('tenant_documents')
    .getPublicUrl(filePath);

  if (!publicUrl) {
    throw new Error("Failed to generate public URL");
  }

  console.log("Generated public URL:", publicUrl);
  return { publicUrl };
};

const saveDocumentReference = async (tenantId: string, fileName: string, publicUrl: string) => {
  const { error: dbError } = await supabase
    .from('tenant_documents')
    .insert({
      tenant_id: tenantId,
      name: fileName,
      file_url: publicUrl
    });

  if (dbError) {
    console.error('Database error:', dbError);
    throw dbError;
  }
};

const getInitialContent = (tenant: Tenant, template: string): string => {
  switch (template) {
    case "lease":
      return `LEASE AGREEMENT

Tenant: ${tenant.name}
Email: ${tenant.email}
Phone: ${tenant.phone || 'Not provided'}
Property: ${tenant.properties?.name || 'Not specified'}
Unit Number: ${tenant.unit_number}
Start Date: ${tenant.lease_start}
End Date: ${tenant.lease_end}
Monthly Rent: $${tenant.rent_amount}

[The rest of the contract can be edited here]`;

    case "receipt":
      return `RENT RECEIPT

Tenant: ${tenant.name}
Property: ${tenant.properties?.name || 'Not specified'}
Unit Number: ${tenant.unit_number}
Amount: $${tenant.rent_amount}
Date: ${new Date().toLocaleDateString()}

[Payment details can be edited here]`;

    case "notice":
      return `NOTICE TO VACATE

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

    default:
      throw new Error("Template not implemented");
  }
};