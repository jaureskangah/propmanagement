
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Sparkles } from "lucide-react";
import { DocumentTemplateSelector } from "@/components/documents/DocumentTemplateSelector";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Tenant } from "@/types/tenant";
import { motion } from "framer-motion";

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
    <Card className="h-full overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-xl shadow-primary/5">
      <CardHeader className="border-b border-primary/10 bg-gradient-to-r from-primary/5 to-transparent">
        <motion.div 
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center space-x-3"
        >
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {t('documentGenerator.documentTemplates')}
            </CardTitle>
            <p className="text-sm text-muted-foreground/70 mt-1">Choisissez votre point de départ</p>
          </div>
        </motion.div>
      </CardHeader>
      
      <CardContent className="pt-8 pb-6 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Quick Stats */}
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Templates disponibles</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-white/70 rounded-lg p-2">
                <div className="text-lg font-bold text-blue-600">10+</div>
                <div className="text-xs text-blue-700">Contrats</div>
              </div>
              <div className="bg-white/70 rounded-lg p-2">
                <div className="text-lg font-bold text-green-600">5+</div>
                <div className="text-xs text-green-700">Avis</div>
              </div>
            </div>
          </div>

          <DocumentTemplateSelector 
            selectedTemplate={selectedTemplate}
            onSelectTemplate={onSelectTemplate}
            onGenerateContent={onGenerateContent}
            setIsGenerating={(value) => {}}
            tenant={tenant}
          />
        </motion.div>
      </CardContent>
    </Card>
  );
}
