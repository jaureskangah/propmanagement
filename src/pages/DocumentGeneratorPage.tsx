import React, { useState, useCallback } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { DocumentTemplateSelect } from "@/components/documents/DocumentTemplateSelect";
import { DocumentEditor } from "@/components/documents/DocumentEditor";
import { Button } from "@/components/ui/button";
import { useTemplates } from "@/hooks/useTemplates";
import { useToast } from "@/hooks/use-toast";
import { DocumentPreview } from "@/components/documents/DocumentPreview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDebounce } from "@/hooks/use-debounce";
import { useSearchParams } from "react-router-dom";
import { DocumentHistoryTab } from "@/components/documents/history/DocumentHistoryTab";

export default function DocumentGeneratorPage() {
  const { t } = useLocale();
  const { templates, isLoading: isLoadingTemplates } = useTemplates();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [documentContent, setDocumentContent] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const debouncedContent = useDebounce(documentContent, 500);

  const handleTemplateSelect = useCallback((templateId: string) => {
    setSelectedTemplate(templateId);
    
    // Update content with template content
    const template = templates?.find(t => t.id === templateId);
    if (template) {
      setDocumentContent(template.content);
    }
    
    // Update URL
    setSearchParams({ template: templateId });
  }, [templates, setSearchParams]);

  const handleContentChange = (content: string) => {
    setDocumentContent(content);
  };

  const handleGeneratePreview = async () => {
    try {
      // Call the edge function to generate the PDF
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: debouncedContent }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPreviewUrl(data.url);
      
      toast({
        title: t('documentGenerator.templateLoaded'),
        description: t('documentGenerator.templateLoadedDescription')
      });
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer l'aperçu du document",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">{t('documentGenerator.documentGenerator')}</h1>
        
      <Tabs defaultValue="templates">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates">{t('documentGenerator.documentTemplates')}</TabsTrigger>
          <TabsTrigger value="content">{t('documentGenerator.editContent')}</TabsTrigger>
          <TabsTrigger value="history">{t('documentGenerator.history')}</TabsTrigger>
        </TabsList>
          
        <TabsContent value="templates" className="space-y-4">
          <DocumentTemplateSelect
            templates={templates}
            isLoading={isLoadingTemplates}
            onSelectTemplate={handleTemplateSelect}
            selectedTemplate={selectedTemplate}
          />
        </TabsContent>
          
        <TabsContent value="content" className="space-y-4">
          <DocumentEditor
            content={documentContent}
            onContentChange={handleContentChange}
          />
          <Button onClick={handleGeneratePreview}>
            {t('documentGenerator.generatePreview')}
          </Button>
        </TabsContent>
          
        <TabsContent value="history">
          <DocumentHistoryTab />
        </TabsContent>
      </Tabs>
        
      <DocumentPreview 
        previewUrl={previewUrl}
        documentContent={documentContent}
        templateName={selectedTemplate || 'custom'}
      />
    </div>
  );
}
