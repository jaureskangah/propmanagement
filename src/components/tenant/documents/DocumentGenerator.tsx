
import { useState, useEffect } from "react";
import { useDocumentGenerator } from "./hooks/useDocumentGenerator";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DialogManager } from "@/components/documents/editor/DialogManager";
import { DocumentEditor } from "@/components/documents/DocumentEditor";
import { DocumentPreview } from "@/components/documents/DocumentPreview";
import { DocumentTemplateSelector } from "@/components/documents/DocumentTemplateSelector";
import { Loader2, Send, Download } from "lucide-react";
import { useTenant } from "@/components/providers/TenantProvider";
import { TenantProvider } from "@/components/providers/TenantProvider";

export function DocumentGenerator() {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState<string>("edit");
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isSignatureDialogOpen, setIsSignatureDialogOpen] = useState(false);
  const [isGeneratingState, setIsGeneratingState] = useState(false);
  
  // Try to use TenantProvider context, but don't fail if it's not available
  const tenantContext = (() => {
    try {
      return useTenant();
    } catch (e) {
      return { tenant: null };
    }
  })();
  
  const {
    content,
    setContent,
    templateName,
    setTemplateName,
    isGenerating,
    previewUrl,
    previewError,
    handleTemplateChange,
    generatePreview,
    saveDocument,
    resetDocument
  } = useDocumentGenerator();
  
  // Automatically generate preview when switching to preview tab
  useEffect(() => {
    if (activeTab === "preview" && content && !previewUrl && !isGenerating && !previewError) {
      generatePreview();
    }
  }, [activeTab, content, previewUrl, isGenerating, previewError, generatePreview]);
  
  const handleGenerateDocument = async () => {
    await generatePreview();
    setActiveTab("preview");
  };
  
  const handleShareDocument = () => {
    if (!previewUrl) {
      generatePreview().then(() => {
        setIsShareDialogOpen(true);
      });
    } else {
      setIsShareDialogOpen(true);
    }
  };
  
  const handleDownload = () => {
    if (previewUrl) {
      window.open(previewUrl, '_blank');
    }
  };
  
  const handleInsertSignature = (signatureDataUrl: string) => {
    setContent(prev => `${prev}\n\n${signatureDataUrl}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <DocumentTemplateSelector
          onSelectTemplate={handleTemplateChange}
          selectedTemplate={templateName}
          onGenerateContent={setContent}
          setIsGenerating={setIsGeneratingState}
          tenant={tenantContext.tenant}
        />
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAIDialogOpen(true)}
            className="flex-1 sm:flex-none"
          >
            {t('documentGenerator.aiAssistant')}
          </Button>
          
          <Button
            variant="default"
            size="sm"
            onClick={handleGenerateDocument}
            disabled={!content || isGenerating}
            className="flex-1 sm:flex-none"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('documentGenerator.generating')}
              </>
            ) : (
              <>{t('documentGenerator.generatePreview')}</>
            )}
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 sm:w-[400px]">
          <TabsTrigger value="edit">{t('documentGenerator.edit')}</TabsTrigger>
          <TabsTrigger value="preview" disabled={!content}>
            {t('documentGenerator.preview')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="edit" className="space-y-4">
          <DocumentEditor 
            content={content} 
            onContentChange={setContent} 
            onGeneratePreview={handleGenerateDocument}
            isGenerating={isGenerating}
            templateName={templateName}
            tenant={tenantContext.tenant}
            onOpenSaveTemplateDialog={() => setIsTemplateDialogOpen(true)}
          />
          
          <div className="flex flex-wrap gap-3 mt-4">
            <Button
              variant="default"
              onClick={handleGenerateDocument}
              disabled={!content || isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('documentGenerator.generating')}
                </>
              ) : (
                <>{t('documentGenerator.generatePreview')}</>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setIsTemplateDialogOpen(true)}
              disabled={!content}
            >
              {t('documentGenerator.saveTemplate')}
            </Button>
            
            <Button
              variant="outline"
              onClick={resetDocument}
              disabled={!content}
            >
              {t('documentGenerator.reset')}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="preview" className="h-[600px]">
          <DocumentPreview
            previewUrl={previewUrl}
            isGenerating={isGenerating}
            documentContent={content}
            templateName={templateName}
            onShare={handleShareDocument}
            previewError={previewError}
            onDownload={handleDownload}
            tenant={tenantContext.tenant}
          />
          
          <div className="flex flex-wrap gap-3 mt-4">
            <Button
              variant="default"
              onClick={saveDocument}
              disabled={!previewUrl || isGenerating}
            >
              {t('documentGenerator.saveDocument')}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleShareDocument}
              disabled={!previewUrl || isGenerating}
            >
              <Send className="mr-2 h-4 w-4" />
              {t('documentGenerator.shareDocument')}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleDownload}
              disabled={!previewUrl || isGenerating}
            >
              <Download className="mr-2 h-4 w-4" />
              {t('documentGenerator.download')}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      
      <DialogManager
        isAIDialogOpen={isAIDialogOpen}
        setIsAIDialogOpen={setIsAIDialogOpen}
        isShareDialogOpen={isShareDialogOpen}
        setIsShareDialogOpen={setIsShareDialogOpen}
        isSaveTemplateDialogOpen={isTemplateDialogOpen}
        setIsSaveTemplateDialogOpen={setIsTemplateDialogOpen}
        isSignatureDialogOpen={isSignatureDialogOpen}
        setIsSignatureDialogOpen={setIsSignatureDialogOpen}
        content={content}
        onContentChange={setContent}
        onInsertSignature={handleInsertSignature}
        templateName={templateName}
        tenant={tenantContext.tenant}
      />
    </div>
  );
}

// Wrapper component to ensure TenantProvider is available
export function DocumentGeneratorWithProvider() {
  return (
    <TenantProvider>
      <DocumentGenerator />
    </TenantProvider>
  );
}
