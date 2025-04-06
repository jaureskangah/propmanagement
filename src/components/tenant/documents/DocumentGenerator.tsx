import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, FileCheck, FilePlus } from "lucide-react";
import { DocumentTemplateSelector } from "@/components/documents/DocumentTemplateSelector";
import { DocumentEditor } from "@/components/documents/DocumentEditor";
import { DocumentPreview } from "@/components/documents/DocumentPreview";
import { useToast } from "@/hooks/use-toast";
import { generateCustomPdf } from "@/components/tenant/documents/templates/customPdf";
import { useDocumentHistory } from "@/hooks/useDocumentHistory";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useTenantData } from "./hooks/useTenantData";

export const DocumentGenerator = () => {
  const { t } = useLocale();
  const { toast } = useToast();
  const { addToHistory } = useDocumentHistory();
  const { tenant } = useTenantData({}, {});
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const [documentContent, setDocumentContent] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("editor");
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [autoPreviewEnabled, setAutoPreviewEnabled] = useState(true);

  const handleSelectTemplate = (templateId: string, templateName: string) => {
    setSelectedTemplate(templateId);
    setSelectedTemplateName(templateName);
  };

  useEffect(() => {
    console.log("DocumentGenerator: Active tab changed to:", activeTab);
  }, [activeTab]);

  useEffect(() => {
    console.log("DocumentGenerator: Preview URL updated:", previewUrl ? `${previewUrl.substring(0, 30)}...` : "null");
  }, [previewUrl]);

  const handleGeneratePreview = async (content: string) => {
    console.log("=== DEBUG: Starting preview generation with actual content ===");
    console.log("Content length:", content.length);
    
    if (isGenerating || !content || content.trim() === '') {
      return;
    }
    
    setIsGenerating(true);
    setPreviewError(null);
    
    try {
      console.log("DocumentGenerator: Generating enhanced PDF with actual content");
      
      const lines = content.split('\n');
      const title = lines.length > 0 ? lines[0].trim() : 'Document';
      
      const pdfBuffer = await generateCustomPdf(content, {
        title: title,
        headerText: selectedTemplateName || 'Document',
        showPageNumbers: true,
        showDate: true
      });
      
      const pdfBlob = new Blob([pdfBuffer], { type: 'application/pdf' });
      
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
      
      const newPreviewUrl = URL.createObjectURL(pdfBlob);
      
      console.log("Preview URL type:", typeof newPreviewUrl);
      console.log("Preview URL starts with:", newPreviewUrl.substring(0, 50) + "...");
      
      setPreviewUrl(newPreviewUrl);
      console.log("=== DEBUG: Preview generation completed with actual content ===");
    } catch (error) {
      console.error("Error generating preview:", error);
      setPreviewError(error instanceof Error ? error.message : "Erreur inconnue lors de la génération de l'aperçu");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToHistory = async (fileUrl: string | null) => {
    if (!documentContent || !selectedTemplateName) return;
    
    const docName = selectedTemplateName || "Document";
    const docCategory = selectedTemplate ? 
      (selectedTemplate.includes("lease") ? "leaseDocuments" : 
       selectedTemplate.includes("payment") ? "paymentDocuments" :
       selectedTemplate.includes("notice") ? "noticeDocuments" :
       selectedTemplate.includes("inspection") ? "inspectionDocuments" : "miscDocuments") 
      : "miscDocuments";
    
    const historyEntry = {
      name: docName,
      category: docCategory,
      documentType: selectedTemplate || "customDocument",
      fileUrl: fileUrl,
      content: documentContent
    };
    
    const result = await addToHistory(historyEntry);
    
    if (result) {
      toast({
        title: t('documentSaved'),
        description: t('documentSavedDescription')
      });
    }
  };

  const handleDownload = async () => {
    if (!previewUrl) return;
    
    const link = document.createElement("a");
    link.href = previewUrl;
    link.download = `${selectedTemplateName || "document"}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    await handleSaveToHistory(previewUrl);
    
    toast({
      title: t('downloadStarted'),
      description: t('downloadStartedDescription')
    });
  };

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
        console.log("DocumentGenerator: Cleaned up preview URL");
      }
    };
  }, [previewUrl]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-4">
        <Card className="h-full">
          <CardHeader className="border-b">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>{t('documentTemplates') || "Document Templates"}</CardTitle>
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
                
                if (autoPreviewEnabled && content) {
                  setTimeout(() => handleGeneratePreview(content), 500);
                }
              }}
              setIsGenerating={setIsGenerating}
            />
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-8">
        <Card className="h-full">
          <CardHeader className="border-b">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="editor">
                  <FileCheck className="h-4 w-4 mr-2" />
                  {t('editContent') || "Edit Content"}
                </TabsTrigger>
                <TabsTrigger value="preview">
                  <FilePlus className="h-4 w-4 mr-2" />
                  {t('preview') || "Preview"}
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
                  onDownload={handleDownload}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
