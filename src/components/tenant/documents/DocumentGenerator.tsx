
import { motion } from "framer-motion";
import { SaveTemplateDialog } from "@/components/documents/editor/SaveTemplateDialog";
import { Tenant } from "@/types/tenant";
import { useDocumentGenerator } from "./hooks/useDocumentGenerator";
import { DocumentTemplateSection } from "./components/DocumentTemplateSection";
import { DocumentEditorSection } from "./components/DocumentEditorSection";
import { useTenant as useTenantCtx } from "@/components/providers/TenantProvider";

export function DocumentGenerator({ tenant }: { tenant?: Tenant | null }) {
  // Fallback to TenantProvider context when tenant prop is not provided
  let effectiveTenant: Tenant | null = null;
  try {
    const { tenant: tenantFromContext } = useTenantCtx();
    effectiveTenant = tenant ?? tenantFromContext ?? null;
  } catch {
    // If used outside of TenantProvider, silently ignore and rely on prop
    effectiveTenant = tenant ?? null;
  }

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
  } = useDocumentGenerator(effectiveTenant);

  return (
    <div className="space-y-8">
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-4"
        >
          <DocumentTemplateSection 
            selectedTemplate={selectedTemplate}
            onSelectTemplate={handleSelectTemplate}
            onGenerateContent={(content) => {
              setDocumentContent(content);
            }}
            isGenerating={isGenerating}
            tenant={effectiveTenant}
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="lg:col-span-8"
        >
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
        </motion.div>
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
