
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { DocumentTemplateSelector } from "@/components/documents/DocumentTemplateSelector";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Tenant } from "@/types/tenant";

interface DocumentTemplateSectionProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string, templateName: string) => void;
  onGenerateContent: (content: string) => void;
  isGenerating: boolean;
  tenant?: Tenant | null;
}

export function DocumentTemplateSection({
  selectedTemplate,
  onSelectTemplate,
  onGenerateContent,
  isGenerating,
  tenant
}: DocumentTemplateSectionProps) {
  const { t } = useLocale();

  return (
    <Card className="h-full">
      <CardHeader className="border-b">
        <div className="flex items-center space-x-2">
          <FileText className="h-4 w-4 text-primary" />
          <CardTitle className="text-base font-medium">{t('documentGenerator.documentTemplates') || "Modèles de documents"}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <DocumentTemplateSelector 
          selectedTemplate={selectedTemplate}
          onSelectTemplate={onSelectTemplate}
          onGenerateContent={onGenerateContent}
          setIsGenerating={(value) => {}} // We'll ignore setting this value as we're now passing in a read-only state
          tenant={tenant}
        />
      </CardContent>
    </Card>
  );
}
