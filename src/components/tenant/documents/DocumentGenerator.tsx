
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
    <div className="space-y-8">
      {/* Enhanced Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/3 to-purple-500/5 p-8 border border-primary/10 shadow-lg"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform skew-x-12 animate-shimmer"></div>
        <div className="relative">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/90 to-purple-600 bg-clip-text text-transparent">
                Document Generator
              </h2>
              <p className="text-muted-foreground/80 mt-1">Créez des documents professionnels en quelques clics</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-white/20">
              <div className="text-2xl font-bold text-primary">15+</div>
              <div className="text-sm text-muted-foreground">Modèles</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-white/20">
              <div className="text-2xl font-bold text-green-600">100%</div>
              <div className="text-sm text-muted-foreground">Personnalisable</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-white/20">
              <div className="text-2xl font-bold text-blue-600">PDF</div>
              <div className="text-sm text-muted-foreground">Export</div>
            </div>
          </div>
        </div>
      </motion.div>

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
            tenant={tenant}
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
