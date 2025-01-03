import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateLeaseAgreement } from "./templates/leaseAgreement";
import { generateRentalReceipt } from "./templates/rentalReceipt";
import { generateCustomPdf } from "./templates/customPdf";
import type { Tenant } from "@/types/tenant";
import { supabase } from "@/lib/supabase";
import { DocumentPreview } from "./DocumentPreview";
import { TemplateSelector } from "./TemplateSelector";

interface DocumentGeneratorProps {
  tenant: Tenant;
  onDocumentGenerated: () => void;
}

export const DocumentGenerator = ({ tenant, onDocumentGenerated }: DocumentGeneratorProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
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
      let fileName;

      switch (selectedTemplate) {
        case "lease":
          pdfDoc = await generateLeaseAgreement(tenant);
          fileName = `lease_agreement_${tenant.name.toLowerCase().replace(/\s+/g, '_')}.pdf`;
          break;
        case "receipt":
          pdfDoc = await generateRentalReceipt(tenant);
          fileName = `rental_receipt_${tenant.name.toLowerCase().replace(/\s+/g, '_')}.pdf`;
          break;
        default:
          throw new Error("Template not implemented");
      }

      const pdfBlob = new Blob([pdfDoc], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setGeneratedPdfUrl(pdfUrl);
      setShowPreview(true);

      // Convertir le PDF en texte pour l'édition
      const reader = new FileReader();
      reader.onload = function(e) {
        setEditedContent(e.target?.result as string);
      };
      reader.readAsText(pdfBlob);

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
        ? `lease_agreement_${tenant.name.toLowerCase().replace(/\s+/g, '_')}.pdf`
        : `rental_receipt_${tenant.name.toLowerCase().replace(/\s+/g, '_')}.pdf`;

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
      // Créer un nouveau PDF avec le contenu édité
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg">Document Generator</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <TemplateSelector
          selectedTemplate={selectedTemplate}
          onTemplateChange={setSelectedTemplate}
          onGenerate={generateDocument}
          isGenerating={isGenerating}
        />

        <DocumentPreview
          showPreview={showPreview}
          setShowPreview={setShowPreview}
          generatedPdfUrl={generatedPdfUrl}
          isEditing={isEditing}
          editedContent={editedContent}
          onEditContent={setEditedContent}
          onEdit={handleEdit}
          onSaveEdit={handleSaveEdit}
          onDownload={handleDownload}
        />
      </CardContent>
    </Card>
  );
};