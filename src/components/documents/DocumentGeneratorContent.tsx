
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentTemplates } from "./templates/DocumentTemplates";
import { TemplateEditor } from "./editor/TemplateEditor";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Card } from "@/components/ui/card";

export interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  content: string;
}

export const DocumentGeneratorContent = () => {
  const { t } = useLocale();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-5 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <Tabs defaultValue="templates" className="w-full">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="templates">{t('templates')}</TabsTrigger>
                <TabsTrigger value="saved">{t('savedDocuments')}</TabsTrigger>
              </TabsList>
              <TabsContent value="templates">
                <DocumentTemplates onSelectTemplate={setSelectedTemplate} />
              </TabsContent>
              <TabsContent value="saved">
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  {t('noSavedDocuments')}
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
        
        <div className="md:col-span-3">
          <TemplateEditor 
            selectedTemplate={selectedTemplate} 
            onClearSelection={() => setSelectedTemplate(null)}
          />
        </div>
      </div>
    </div>
  );
};
