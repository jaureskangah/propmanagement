import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { generateLeaseAgreement } from "./templates/leaseAgreement";
import { generateRentalReceipt } from "./templates/rentalReceipt";
import type { Tenant } from "@/types/tenant";
import { supabase } from "@/lib/supabase";

interface DocumentGeneratorProps {
  tenant: Tenant;
  onDocumentGenerated: () => void;
}

export const DocumentGenerator = ({ tenant, onDocumentGenerated }: DocumentGeneratorProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
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

      // Generate PDF blob
      const pdfBlob = await pdfDoc.getBlob();
      const file = new File([pdfBlob], fileName, { type: 'application/pdf' });

      // Upload to Supabase Storage
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
        description: "Document generated and saved successfully",
      });

      onDocumentGenerated();
    } catch (error) {
      console.error('Document generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate document",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setSelectedTemplate("");
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
          <Download className="mr-2 h-4 w-4" />
          {isGenerating ? "Generating..." : "Generate Document"}
        </Button>
      </CardContent>
    </Card>
  );
};