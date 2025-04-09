
import { useEffect, useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentTemplateSelector } from "@/components/documents/DocumentTemplateSelector";
import { DocumentEditor } from "@/components/documents/DocumentEditor";
import { DocumentPreview } from "@/components/documents/DocumentPreview";
import { useDocumentGenerator } from "./hooks/useDocumentGenerator";
import { useTenant } from "@/components/tenant/hooks/useTenant";

export const DocumentGenerator = () => {
  const { t } = useLocale();
  const { tenant } = useTenant();
  const { 
    selectedTemplate,
    selectedTemplateName,
    documentContent,
    setDocumentContent,
    previewUrl,
    isGenerating,
    activeTab,
    setActiveTab,
    previewError,
    handleSelectTemplate,
    handleGeneratePreview,
    handleDownload,
    handleInsertDynamicField,
    handleUpdatePreview
  } = useDocumentGenerator(tenant);

  const [documentType, setDocumentType] = useState<string | undefined>(undefined);

  useEffect(() => {
    setDocumentType(selectedTemplate);
  }, [selectedTemplate]);

  const handleShare = () => {
    console.log("Share document");
  };

  return (
    <div className="h-full flex flex-col">
      <DocumentTemplateSelector 
        selectedTemplate={selectedTemplate}
        onSelectTemplate={handleSelectTemplate}
        onGenerateContent={setDocumentContent}
        setIsGenerating={() => {}}
        tenant={tenant}
      />
      
      {selectedTemplate && (
        <Tabs 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full mt-6"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="editor">{t('documentGenerator.editContent')}</TabsTrigger>
            <TabsTrigger value="preview">{t('documentGenerator.preview')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor">
            <DocumentEditor 
              content={documentContent}
              onContentChange={setDocumentContent}
              onGeneratePreview={() => handleGeneratePreview(documentContent)}
              isGenerating={isGenerating}
              tenant={tenant}
              onInsertDynamicField={handleInsertDynamicField}
            />
          </TabsContent>
          
          <TabsContent value="preview" className="h-full">
            <DocumentPreview 
              previewUrl={previewUrl}
              isGenerating={isGenerating}
              documentContent={documentContent}
              templateName={selectedTemplateName}
              documentType={documentType}
              onShare={handleShare}
              previewError={previewError}
              onDownload={handleDownload}
              onUpdatePreview={handleUpdatePreview}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
