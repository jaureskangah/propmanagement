
import { useLocale } from "@/components/providers/LocaleProvider";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DocumentTemplate } from "@/hooks/useTemplates";

interface DocumentTemplateSelectProps {
  templates: DocumentTemplate[] | undefined;
  isLoading: boolean;
  onSelectTemplate: (templateId: string) => void;
  selectedTemplate: string | null;
}

export function DocumentTemplateSelect({
  templates = [],
  isLoading,
  onSelectTemplate,
  selectedTemplate
}: DocumentTemplateSelectProps) {
  const { t } = useLocale();

  if (isLoading) {
    return <div className="text-center p-4">{t('common.loading')}</div>;
  }

  if (!templates || templates.length === 0) {
    return <div className="text-center p-4">{t('noTemplatesFound')}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('documentTemplates')}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-2">
            {templates.map((template) => (
              <Button
                key={template.id}
                variant={selectedTemplate === template.id ? "default" : "outline"}
                className="w-full justify-start text-left"
                onClick={() => onSelectTemplate(template.id)}
              >
                {template.name}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
