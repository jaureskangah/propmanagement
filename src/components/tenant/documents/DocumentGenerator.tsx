
import { useState, useEffect } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { FileText, FileCheck, FilePlus } from "lucide-react";
import { DocumentTemplateSelector } from "@/components/documents/DocumentTemplateSelector";
import { DocumentEditor } from "@/components/documents/DocumentEditor";
import { DocumentPreview } from "@/components/documents/DocumentPreview";
import { useToast } from "@/hooks/use-toast";
import { generateCustomPdf } from "@/components/tenant/documents/templates/customPdf";
import { Tenant } from "@/types/tenant";
import { DynamicFieldsMenu } from "@/components/documents/editor/DynamicFieldsMenu";

export function DocumentGenerator({ tenant }: { tenant?: Tenant | null }) {
  const { t } = useLocale();
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const [documentContent, setDocumentContent] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("editor");
  const [previewError, setPreviewError] = useState<string | null>(null);

  const handleSelectTemplate = (templateId: string, templateName: string) => {
    setSelectedTemplate(templateId);
    setSelectedTemplateName(templateName);
  };

  const handleGeneratePreview = async (content: string) => {
    setIsGenerating(true);
    setPreviewError(null);
    
    try {
      if (!content || content.trim() === '') {
        throw new Error(t('documentGenerator.emptyDocument') || "Le contenu du document est vide");
      }
      
      try {
        const lines = content.split('\n');
        const title = lines.length > 0 ? lines[0].trim() : t('documentGenerator.document') || 'Document';
        
        const pdfBuffer = await generateCustomPdf(content, {
          title: title,
          headerText: selectedTemplateName || t('documentGenerator.document') || 'Document',
          showPageNumbers: true,
          showDate: true
        });
        
        const pdfBlob = new Blob([pdfBuffer], { type: 'application/pdf' });
        const previewUrl = URL.createObjectURL(pdfBlob);
        
        setPreviewUrl(previewUrl);
        setActiveTab("preview");
      } catch (pdfError) {
        console.error("Error generating PDF from content:", pdfError);
        throw new Error(t('documentGenerator.pdfGenerationError') || "Erreur lors de la génération du PDF");
      }
    } catch (error) {
      console.error("Error generating preview:", error);
      setPreviewError(error instanceof Error ? error.message : t('documentGenerator.unknownError') || "Erreur inconnue");
      setActiveTab("preview");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToHistory = async () => {
    // Implement history saving logic here
    toast({
      title: t('documentGenerator.documentSaved') || "Document enregistré",
      description: t('documentGenerator.documentSavedDescription') || "Votre document a été enregistré avec succès"
    });
  };

  const handleDownload = async () => {
    if (!previewUrl) return;
    
    const link = document.createElement("a");
    link.href = previewUrl;
    link.download = `${selectedTemplateName || t('documentGenerator.document') || "document"}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    await handleSaveToHistory();
    
    toast({
      title: t('documentGenerator.downloadStarted') || "Téléchargement commencé",
      description: t('documentGenerator.downloadStartedDescription') || "Votre document sera téléchargé dans quelques instants"
    });
  };

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
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
              <CardTitle>{t('documentGenerator.documentTemplates') || "Modèles de documents"}</CardTitle>
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
              }}
              setIsGenerating={setIsGenerating}
              tenant={tenant}
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
                  {t('documentGenerator.editContent') || "Éditer le contenu"}
                </TabsTrigger>
                <TabsTrigger value="preview" onClick={() => {
                  if (!previewUrl && documentContent) {
                    handleGeneratePreview(documentContent);
                  }
                }}>
                  <FilePlus className="h-4 w-4 mr-2" />
                  {t('documentGenerator.preview') || "Aperçu"}
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
                  rightSlot={
                    <DynamicFieldsMenu 
                      onInsertField={(field) => {
                        setDocumentContent(prev => {
                          const textarea = document.querySelector('textarea');
                          if (!textarea) return prev + field;
                          
                          const start = textarea.selectionStart;
                          const end = textarea.selectionEnd;
                          
                          return prev.substring(0, start) + field + prev.substring(end);
                        });
                      }} 
                      title={t('documentGenerator.insertDynamicField') || "Insérer un champ dynamique"}
                    />
                  }
                />
              </TabsContent>
              <TabsContent value="preview" className="mt-0">
                <DocumentPreview 
                  previewUrl={previewUrl}
                  isGenerating={isGenerating}
                  documentContent={documentContent}
                  templateName={selectedTemplate}
                  onShare={() => {}}
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
}
