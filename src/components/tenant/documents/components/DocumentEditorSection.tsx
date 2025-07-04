
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileCheck, FilePlus } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { DocumentEditor } from "@/components/documents/DocumentEditor";
import { DocumentPreview } from "@/components/documents/DocumentPreview";
import { Tenant } from "@/types/tenant";

interface DocumentEditorSectionProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  documentContent: string;
  setDocumentContent: (content: string) => void;
  handleGeneratePreview: (content: string) => void;
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

  return (
    <Card className="h-full">
      <CardHeader className="border-b">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="editor">
              <FileCheck className="h-4 w-4 mr-2" />
              {t('documentGenerator.editContent')}
            </TabsTrigger>
            <TabsTrigger value="preview" onClick={() => {
              if (!previewUrl && documentContent) {
                handleGeneratePreview(documentContent);
              }
            }}>
              <FilePlus className="h-4 w-4 mr-2" />
              {t('documentGenerator.preview')}
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
              onOpenSaveTemplateDialog={() => setIsSaveTemplateDialogOpen(true)}
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
  );
}
