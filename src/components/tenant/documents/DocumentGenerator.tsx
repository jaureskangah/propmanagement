import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Tenant } from "@/types/tenant";
import { DocumentPreview } from "./DocumentPreview";
import { TemplateSelector } from "./TemplateSelector";
import { useDocumentGeneration } from "./hooks/useDocumentGeneration";

interface DocumentGeneratorProps {
  tenant: Tenant;
  onDocumentGenerated: () => void;
}

export const DocumentGenerator = ({ tenant, onDocumentGenerated }: DocumentGeneratorProps) => {
  const [showPreview, setShowPreview] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  
  const {
    selectedTemplate,
    setSelectedTemplate,
    isGenerating,
    generatedPdfUrl,
    generateDocument,
    handleDownload,
    handleEdit,
    handleSaveEdit,
  } = useDocumentGeneration({
    tenant,
    onDocumentGenerated,
    setShowPreview,
    setIsEditing,
    editedContent,
    setEditedContent,
  });

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