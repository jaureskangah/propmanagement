
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { DocumentTemplateSelector } from "@/components/documents/DocumentTemplateSelector";
import { useLocale } from "@/components/providers/LocaleProvider";

interface TemplatesPanelProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string, templateName: string) => void;
  onGenerateContent: (content: string) => void;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
  autoPreviewEnabled: boolean;
}

export const TemplatesPanel = ({
  selectedTemplate,
  onSelectTemplate,
  onGenerateContent,
  isGenerating,
  setIsGenerating,
  autoPreviewEnabled
}: TemplatesPanelProps) => {
  const { t } = useLocale();

  return (
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
          onSelectTemplate={onSelectTemplate}
          onGenerateContent={(content) => {
            onGenerateContent(content);
            if (autoPreviewEnabled && content) {
              setTimeout(() => onGenerateContent(content), 500);
            }
          }}
          setIsGenerating={setIsGenerating}
        />
      </CardContent>
    </Card>
  );
};
