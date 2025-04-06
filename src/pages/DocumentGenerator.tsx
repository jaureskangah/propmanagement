
import { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import { motion } from "framer-motion";
import { useDocumentGenerator } from "@/components/documents/generator/hooks/useDocumentGenerator";
import { DocumentGeneratorHeader } from "@/components/documents/generator/DocumentGeneratorHeader";
import { TemplatesPanel } from "@/components/documents/generator/TemplatesPanel";
import { EditorPreviewPanel } from "@/components/documents/generator/EditorPreviewPanel";

const DocumentGenerator = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  
  const {
    selectedTemplate,
    selectedTemplateName,
    documentContent,
    previewUrl,
    isGenerating,
    activeTab,
    previewError,
    autoPreviewEnabled,
    setDocumentContent,
    setActiveTab,
    handleSelectTemplate,
    handleGeneratePreview,
    handleDownload
  } = useDocumentGenerator();

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarCollapsed} />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DocumentGeneratorHeader />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4">
                <TemplatesPanel 
                  selectedTemplate={selectedTemplate}
                  onSelectTemplate={handleSelectTemplate}
                  onGenerateContent={setDocumentContent}
                  isGenerating={isGenerating}
                  setIsGenerating={(value) => console.log("Setting isGenerating to", value)}
                  autoPreviewEnabled={autoPreviewEnabled}
                />
              </div>

              <div className="lg:col-span-8">
                <EditorPreviewPanel 
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  documentContent={documentContent}
                  onContentChange={setDocumentContent}
                  onGeneratePreview={handleGeneratePreview}
                  isGenerating={isGenerating}
                  templateName={selectedTemplate}
                  previewUrl={previewUrl}
                  previewError={previewError}
                  onDownload={handleDownload}
                  onShare={() => setIsShareDialogOpen(true)}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DocumentGenerator;
