
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileCheck, FilePlus } from "lucide-react";
import { DocumentEditor } from "@/components/documents/DocumentEditor";
import { DocumentPreview } from "@/components/documents/DocumentPreview";
import { useLocale } from "@/components/providers/LocaleProvider";

interface EditorPreviewPanelProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  documentContent: string;
  onContentChange: (content: string) => void;
  onGeneratePreview: (content: string) => void;
  isGenerating: boolean;
  templateName: string;
  previewUrl: string | null;
  previewError: string | null;
  onDownload: () => void;
  onShare: () => void;
}

export const EditorPreviewPanel = ({
  activeTab,
  setActiveTab,
  documentContent,
  onContentChange,
  onGeneratePreview,
  isGenerating,
  templateName,
  previewUrl,
  previewError,
  onDownload,
  onShare
}: EditorPreviewPanelProps) => {
  const { t } = useLocale();

  return (
    <Card className="h-full">
      <CardHeader className="border-b">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="editor" className="mt-0">
            <DocumentEditor
              content={documentContent}
              onContentChange={onContentChange}
              onGeneratePreview={onGeneratePreview}
              isGenerating={isGenerating}
              templateName={templateName}
            />
          </TabsContent>
          <TabsContent value="preview" className="mt-0">
            <DocumentPreview 
              previewUrl={previewUrl}
              isGenerating={isGenerating}
              documentContent={documentContent}
              templateName={templateName}
              onShare={onShare}
              previewError={previewError}
              onDownload={onDownload}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
