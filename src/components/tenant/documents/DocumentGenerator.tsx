
import { motion } from "framer-motion";
import { SaveTemplateDialog } from "@/components/documents/editor/SaveTemplateDialog";
import { Tenant } from "@/types/tenant";
import { useDocumentGenerator } from "./hooks/useDocumentGenerator";
import { DocumentTemplateSection } from "./components/DocumentTemplateSection";
import { DocumentEditorSection } from "./components/DocumentEditorSection";

export function DocumentGenerator({ tenant }: { tenant?: Tenant | null }) {
  const {
    selectedTemplate,
    selectedTemplateName,
    documentContent,
    previewUrl,
    isGenerating,
    activeTab,
    previewError,
    isSaveTemplateDialogOpen,
    handleSelectTemplate,
    handleGeneratePreview,
    handleDownload,
    handleInsertDynamicField,
    setDocumentContent,
    setActiveTab,
    setIsSaveTemplateDialogOpen
  } = useDocumentGenerator(tenant);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-4">
        <DocumentTemplateSection 
          selectedTemplate={selectedTemplate}
          onSelectTemplate={handleSelectTemplate}
          onGenerateContent={(content) => {
            setDocumentContent(content);
            setPreviewUrl(null);
            setPreviewError(null);
          }}
          setIsGenerating={setIsGenerating}
          tenant={tenant}
        />
      </div>

      <div className="lg:col-span-8">
        <DocumentEditorSection 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          documentContent={documentContent}
          setDocumentContent={setDocumentContent}
          handleGeneratePreview={handleGeneratePreview}
          isGenerating={isGenerating}
          selectedTemplateName={selectedTemplateName}
          previewUrl={previewUrl}
          previewError={previewError}
          handleDownload={handleDownload}
          selectedTemplate={selectedTemplate}
          setIsSaveTemplateDialogOpen={setIsSaveTemplateDialogOpen}
        />
      </div>
      
      <SaveTemplateDialog
        isOpen={isSaveTemplateDialogOpen}
        onClose={() => setIsSaveTemplateDialogOpen(false)}
        content={documentContent}
        templateName={selectedTemplateName}
      />
    </div>
  );
}
