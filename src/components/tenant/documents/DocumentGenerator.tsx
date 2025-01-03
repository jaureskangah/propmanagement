import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye, Edit, Check, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { generateLeaseAgreement } from "./templates/leaseAgreement";
import { generateRentalReceipt } from "./templates/rentalReceipt";
import type { Tenant } from "@/types/tenant";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DocumentGeneratorProps {
  tenant: Tenant;
  onDocumentGenerated: () => void;
}

export const DocumentGenerator = ({ tenant, onDocumentGenerated }: DocumentGeneratorProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const templates = [
    { id: "lease", name: "Lease Agreement" },
    { id: "receipt", name: "Rental Receipt" },
    { id: "notice", name: "Notice to Vacate" },
  ];

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

      // Create object URL for preview
      const pdfBlob = new Blob([pdfDoc], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setGeneratedPdfUrl(pdfUrl);
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
        ? `lease_agreement_${tenant.name.toLowerCase().replace(/\s+/g, '_')}.pdf`
        : `rental_receipt_${tenant.name.toLowerCase().replace(/\s+/g, '_')}.pdf`;

      // Upload to Supabase Storage
      const response = await fetch(generatedPdfUrl);
      const blob = await response.blob();
      const file = new File([blob], fileName, { type: 'application/pdf' });

      const filePath = `${tenant.id}/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from('tenant_documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('tenant_documents')
        .getPublicUrl(filePath);

      // Save document reference in database
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

      // Clean up
      URL.revokeObjectURL(generatedPdfUrl);
      setGeneratedPdfUrl(null);
      setShowPreview(false);
      setSelectedTemplate("");
      
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg">Document Generator</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select
          value={selectedTemplate}
          onValueChange={setSelectedTemplate}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select document template" />
          </SelectTrigger>
          <SelectContent>
            {templates.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                {template.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={generateDocument}
          disabled={!selectedTemplate || isGenerating}
          className="w-full"
        >
          <FileText className="mr-2 h-4 w-4" />
          {isGenerating ? "Generating..." : "Generate Document"}
        </Button>

        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-4xl h-[80vh]">
            <DialogHeader>
              <DialogTitle>Document Preview</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col h-full space-y-4">
              <div className="flex-1 min-h-0">
                {generatedPdfUrl && (
                  <iframe
                    src={generatedPdfUrl}
                    className="w-full h-full rounded-md border"
                    title="PDF Preview"
                  />
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowPreview(false)}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleDownload}>
                  <Check className="mr-2 h-4 w-4" />
                  Save & Download
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};