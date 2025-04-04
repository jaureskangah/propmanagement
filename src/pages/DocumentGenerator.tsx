
import { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { FileText, FileCheck, FilePlus } from "lucide-react";
import { DocumentTemplateSelector } from "@/components/documents/DocumentTemplateSelector";
import { DocumentEditor } from "@/components/documents/DocumentEditor";
import { DocumentPreview } from "@/components/documents/DocumentPreview";

const DocumentGenerator = () => {
  const { t } = useLocale();
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const [documentContent, setDocumentContent] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSelectTemplate = (templateId: string, templateName: string) => {
    setSelectedTemplate(templateId);
    setSelectedTemplateName(templateName);
  };

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
                    <Tabs defaultValue="editor" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="editor">
                          <FileCheck className="h-4 w-4 mr-2" />
                          {t('editContent')}
                        </TabsTrigger>
                        <TabsTrigger value="preview">
                          <FilePlus className="h-4 w-4 mr-2" />
                          {t('preview')}
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <Tabs defaultValue="editor" className="w-full">
                      <TabsContent value="editor" className="mt-0">
                        <DocumentEditor
                          content={documentContent}
                          onContentChange={setDocumentContent}
                          onGeneratePreview={(content) => {
                            setIsGenerating(true);
                            // Generate preview logic would go here
                            setTimeout(() => {
                              // Mock generating a preview URL
                              setPreviewUrl(`data:application/pdf;base64,${btoa(content)}`);
                              setIsGenerating(false);
                            }, 1000);
                          }}
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
