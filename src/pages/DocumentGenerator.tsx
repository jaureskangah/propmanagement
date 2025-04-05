
import { useState, useEffect } from "react";
import AppSidebar from "@/components/AppSidebar";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { FileText, FileCheck, FilePlus, Share2 } from "lucide-react";
import { DocumentTemplateSelector } from "@/components/documents/DocumentTemplateSelector";
import { DocumentEditor } from "@/components/documents/DocumentEditor";
import { DocumentPreview } from "@/components/documents/DocumentPreview";
import { useToast } from "@/hooks/use-toast";
import { generateCustomPdf } from "@/components/tenant/documents/templates/customPdf";

const DocumentGenerator = () => {
  const { t } = useLocale();
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const [documentContent, setDocumentContent] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("editor");
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const handleSelectTemplate = (templateId: string, templateName: string) => {
    setSelectedTemplate(templateId);
    setSelectedTemplateName(templateName);
  };

  // Add debug logging when tab changes
  useEffect(() => {
    console.log("DocumentGenerator: Active tab changed to:", activeTab);
  }, [activeTab]);

  // Add debug logging when preview URL changes
  useEffect(() => {
    console.log("DocumentGenerator: Preview URL updated:", previewUrl ? `${previewUrl.substring(0, 30)}...` : "null");
  }, [previewUrl]);

  const handleGeneratePreview = async (content: string) => {
    console.log("=== DEBUG: Starting preview generation with actual content ===");
    console.log("Content length:", content.length);
    setIsGenerating(true);
    setPreviewError(null);
    
    try {
      if (!content || content.trim() === '') {
        throw new Error("Le contenu du document est vide");
      }
      
      try {
        // Generate PDF with actual content and enhanced formatting
        console.log("DocumentGenerator: Generating enhanced PDF with actual content");
        
        // Extract document title from content (first line or default)
        const lines = content.split('\n');
        const title = lines.length > 0 ? lines[0].trim() : 'Document';
        
        const pdfBuffer = await generateCustomPdf(content, {
          title: title,
          headerText: selectedTemplateName || 'Document',
          showPageNumbers: true,
          showDate: true
        });
        
        const pdfBlob = new Blob([pdfBuffer], { type: 'application/pdf' });
        const previewUrl = URL.createObjectURL(pdfBlob);
        
        console.log("Preview URL type:", typeof previewUrl);
        console.log("Preview URL starts with:", previewUrl.substring(0, 50) + "...");
        
        setPreviewUrl(previewUrl);
        setIsGenerating(false);
        setActiveTab("preview");
        console.log("=== DEBUG: Preview generation completed with actual content ===");
        console.log("=== DEBUG: Switching to preview tab ===");
      } catch (pdfError) {
        console.error("Error generating PDF from content:", pdfError);
        throw new Error("Erreur lors de la génération du PDF");
      }
    } catch (error) {
      console.error("Error generating preview:", error);
      setPreviewError(error instanceof Error ? error.message : "Erreur inconnue lors de la génération de l'aperçu");
      setIsGenerating(false);
      setActiveTab("preview");
    }
  };

  // Cleanup object URLs when component unmounts or previewUrl changes
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
        console.log("DocumentGenerator: Cleaned up preview URL");
      }
    };
  }, [previewUrl]);

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
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">{t('documentGenerator')}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Document templates selection - Left side */}
              <div className="lg:col-span-4">
                <Card className="h-full">
                  <CardHeader className="border-b">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <CardTitle>{t('documentTemplates')}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <DocumentTemplateSelector 
                      selectedTemplate={selectedTemplate}
                      onSelectTemplate={handleSelectTemplate}
                      onGenerateContent={(content) => {
                        setDocumentContent(content);
                        setPreviewUrl(null);
                        setPreviewError(null);
                        console.log("DocumentGenerator: Template content generated, length:", content.length);
                      }}
                      setIsGenerating={setIsGenerating}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Editor and Preview - Right side */}
              <div className="lg:col-span-8">
                <Card className="h-full">
                  <CardHeader className="border-b">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="editor">
                          <FileCheck className="h-4 w-4 mr-2" />
                          {t('editContent')}
                        </TabsTrigger>
                        <TabsTrigger value="preview" onClick={() => {
                          console.log("DocumentGenerator: Preview tab clicked");
                          if (!previewUrl && documentContent) {
                            console.log("DocumentGenerator: No previewUrl yet, generating preview");
                            handleGeneratePreview(documentContent);
                          }
                        }}>
                          <FilePlus className="h-4 w-4 mr-2" />
                          {t('preview')}
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsContent value="editor" className="mt-0">
                        <DocumentEditor
                          content={documentContent}
                          onContentChange={setDocumentContent}
                          onGeneratePreview={handleGeneratePreview}
                          isGenerating={isGenerating}
                          templateName={selectedTemplateName}
                        />
                      </TabsContent>
                      <TabsContent value="preview" className="mt-0">
                        <DocumentPreview 
                          previewUrl={previewUrl}
                          isGenerating={isGenerating}
                          documentContent={documentContent}
                          templateName={selectedTemplate}
                          onShare={() => setIsShareDialogOpen(true)}
                          previewError={previewError}
                        />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DocumentGenerator;
