
import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TemplateSelector } from "./TemplateSelector";
import { DocumentPreview } from "./DocumentPreview";
import { useTenantData, convertToTenant } from "./hooks/useTenantData";
import { useDocumentGeneration } from "./hooks/useDocumentGeneration";
import { Edit } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

export const DocumentGenerator = () => {
  const [showPreview, setShowPreview] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const { tenant } = useTenantData();
  const { t } = useLocale();

  // Convert TenantData to Tenant when passing to hooks that expect Tenant type
  const tenantForDocGen = tenant ? convertToTenant(tenant) : null;

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
    tenant: tenantForDocGen,
    onDocumentGenerated: () => {
      // Reset state after document generation
      setShowPreview(false);
      setIsEditing(false);
      setEditedContent("");
      setSelectedTemplate("");
    },
    setShowPreview,
    setIsEditing,
    editedContent,
    setEditedContent,
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-4">
        <Card className="h-full">
          <CardHeader>
            <h3 className="text-lg font-medium">{t('selectTemplate')}</h3>
          </CardHeader>
          <CardContent>
            {!showPreview ? (
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onTemplateChange={setSelectedTemplate}
                onGenerate={() => generateDocument(selectedTemplate)}
                isGenerating={isGenerating}
              />
            ) : (
              <div className="space-y-4">
                {isEditing ? (
                  <>
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="w-full min-h-[300px] p-3 border rounded"
                    />
                    <div className="flex justify-end space-x-2">
                      <Button onClick={() => setIsEditing(false)} variant="outline">
                        {t('cancel')}
                      </Button>
                      <Button onClick={() => handleSaveEdit()}>
                        {t('save')}
                      </Button>
                    </div>
                  </>
                ) : (
                  <Button 
                    onClick={handleEdit}
                    variant="outline"
                    className="w-full flex items-center justify-center"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    {t('editDocument')}
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-8">
        <Card className="h-full">
          <CardHeader>
            <h3 className="text-lg font-medium">
              {showPreview ? t('preview') : t('createDocument')}
            </h3>
          </CardHeader>
          <CardContent>
            {showPreview ? (
              <DocumentPreview
                pdfUrl={generatedPdfUrl}
                isLoading={isGenerating}
                onDownload={handleDownload}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <p className="mb-6 text-muted-foreground">
                  {t('selectTemplatePrompt')}
                </p>
                <Button
                  onClick={() => generateDocument(selectedTemplate)}
                  disabled={!selectedTemplate || isGenerating}
                  className="min-w-[200px]"
                >
                  {isGenerating ? t('generating') : t('generateDocument')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
