
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentEditor } from "@/components/documents/DocumentEditor";
import { DocumentPreview } from "@/components/documents/DocumentPreview";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Edit, Eye, Download, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
interface DocumentEditorSectionProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  documentContent: string;
  setDocumentContent: (content: string) => void;
  handleGeneratePreview: () => void;
  isGenerating: boolean;
  selectedTemplateName: string;
  previewUrl: string | null;
  previewError: string | null;
  handleDownload: () => void;
  selectedTemplate: string;
  setIsSaveTemplateDialogOpen: (open: boolean) => void;
}

export function DocumentEditorSection({
  activeTab,
  setActiveTab,
  documentContent,
  setDocumentContent,
  handleGeneratePreview,
  isGenerating,
  selectedTemplateName,
  previewUrl,
  previewError,
  handleDownload,
  selectedTemplate,
  setIsSaveTemplateDialogOpen
}: DocumentEditorSectionProps) {
  const { t } = useLocale();

  // Auto-generate preview when switching to the Preview tab and no preview exists yet
  useEffect(() => {
    if (activeTab === "preview" && !isGenerating && !previewUrl && documentContent?.trim()) {
      handleGeneratePreview();
    }
  }, [activeTab, isGenerating, previewUrl, documentContent, handleGeneratePreview]);
  return (
    <Card className="h-full overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/30 shadow-xl shadow-primary/5">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="h-full"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          {/* Enhanced Tabs Header */}
          <div className="border-b border-primary/10 bg-gradient-to-r from-primary/5 via-transparent to-purple-500/5 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Éditeur de Document
                </h3>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  {selectedTemplateName || "Aucun modèle sélectionné"}
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleGeneratePreview}
                  disabled={!documentContent || isGenerating}
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Aperçu
                </Button>
                <Button
                  onClick={handleDownload}
                  disabled={!previewUrl}
                  size="sm"
                  variant="outline"
                  className="border-primary/20 hover:bg-primary/5"
                >
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </div>
            </div>
            
            {/* Stylized Tabs List */}
            <TabsList className="bg-white/70 backdrop-blur-sm border border-white/40 shadow-sm p-1 h-auto">
              <TabsTrigger 
                value="edit"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 flex items-center gap-2 px-4 py-2.5"
              >
                <Edit className="h-4 w-4" />
                {t('documentGenerator.editContent')}
              </TabsTrigger>
              <TabsTrigger 
                value="preview"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-green-700 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 flex items-center gap-2 px-4 py-2.5"
              >
                <Eye className="h-4 w-4" />
                {t('documentGenerator.preview')}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            <TabsContent value="edit" className="h-full m-0 p-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <DocumentEditor
                  content={documentContent}
                  onContentChange={setDocumentContent}
                  onGeneratePreview={handleGeneratePreview}
                  isGenerating={isGenerating}
                  templateName={selectedTemplateName}
                  onOpenSaveTemplateDialog={() => setIsSaveTemplateDialogOpen(true)}
                />
              </motion.div>
            </TabsContent>

            <TabsContent value="preview" className="h-full m-0 p-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <DocumentPreview
                  previewUrl={previewUrl}
                  isGenerating={isGenerating}
                  documentContent={documentContent}
                  templateName={selectedTemplateName}
                  onShare={() => {}}
                  previewError={previewError}
                  onDownload={handleDownload}
                />
              </motion.div>
            </TabsContent>
          </div>
        </Tabs>
      </motion.div>
    </Card>
  );
}
