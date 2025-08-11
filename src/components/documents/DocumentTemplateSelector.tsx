
import React, { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, BookmarkCheck } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { generateTemplateContent } from "@/components/tenant/documents/templates/templateContent";
import { processDynamicFields } from "@/components/tenant/documents/templates/utils/contentParser";
import { Tenant } from "@/types/tenant";
import { useToast } from "@/hooks/use-toast";
import { UserTemplates } from "@/components/documents/UserTemplates";
import { DocumentTemplate } from "@/hooks/useTemplates";

interface DocumentTemplateSelectorProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string, templateName: string) => void;
  onGenerateContent: (content: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  tenant?: Tenant | null;
}

export function DocumentTemplateSelector({
  selectedTemplate,
  onSelectTemplate,
  onGenerateContent,
  setIsGenerating,
  tenant
}: DocumentTemplateSelectorProps) {
  const { t, language } = useLocale();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showTemplatesDialog, setShowTemplatesDialog] = useState(false);

  const templates = [
    { id: "lease", name: t('documentGenerator.leaseAgreement') },
    { id: "receipt", name: t('documentGenerator.rentReceipt') },
    { id: "notice", name: t('documentGenerator.noticeToVacate') },
    { id: "lease_renewal", name: t('documentGenerator.leaseRenewal') },
    { id: "payment_reminder", name: t('documentGenerator.paymentReminder') },
    { id: "late_payment", name: t('documentGenerator.latePaymentNotice') },
    { id: "entry_notice", name: t('documentGenerator.entryNotice') },
    { id: "maintenance_notice", name: t('documentGenerator.maintenanceNotice') },
    { id: "move_in_checklist", name: t('documentGenerator.moveInChecklist') },
    { id: "move_out_checklist", name: t('documentGenerator.moveOutChecklist') },
  ];

  const handleSelectTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      onSelectTemplate(template.id, template.name);
    }
  };

  const handleGenerateContent = async () => {
    if (!selectedTemplate) return;
    
    setLoading(true);
    setIsGenerating(true);
    
    try {
      let content = '';
      
      try {
        content = generateTemplateContent(selectedTemplate, tenant || undefined, language);
        try { console.log('[TemplateSelector] tenant snapshot', tenant); } catch {}
        
        let enrichedTenant = tenant || null;
        if (tenant) {
          try {
            const { normalizeTenantForDocuments } = await import("@/components/tenant/documents/utils/normalizeTenant");
            enrichedTenant = await normalizeTenantForDocuments(tenant);
          } catch (e) {
            try { console.warn('[TemplateSelector] normalize import failed', e); } catch {}
            enrichedTenant = tenant;
          }
          content = processDynamicFields(content, enrichedTenant || undefined);
        }
        
        onGenerateContent(content);
        toast({
          title: t('documentGenerator.templateLoaded'),
          description: t('documentGenerator.templateLoadedDescription')
        });
      } catch (error) {

        console.error("Error generating template content:", error);
        toast({
          title: t('documentGenerator.errorTitle'),
          description: t('documentGenerator.templateLoadError'),
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
      setIsGenerating(false);
    }
  };

  const handleSelectUserTemplate = (template: DocumentTemplate) => {
    setShowTemplatesDialog(false);
    onGenerateContent(template.content);
    toast({
      title: t('documentGenerator.templateLoaded'),
      description: t('documentGenerator.templateLoadedDescription')
    });
  };
  
  return (
    <div className="space-y-4">
      <Select value={selectedTemplate} onValueChange={handleSelectTemplate}>
        <SelectTrigger>
          <SelectValue placeholder={t('documentGenerator.selectDocumentTemplate')} />
        </SelectTrigger>
        <SelectContent>
          {templates.map((template) => (
            <SelectItem key={template.id} value={template.id}>
              {template.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        onClick={handleGenerateContent}
        disabled={!selectedTemplate || loading}
        className="w-full"
      >
        <FileText className="mr-2 h-4 w-4" />
        {loading ? 
          t('documentGenerator.generating') : 
          t('documentGenerator.generateDocument')
        }
      </Button>
      
      <Button
        onClick={() => setShowTemplatesDialog(true)}
        variant="outline"
        className="w-full flex items-center"
      >
        <BookmarkCheck className="mr-2 h-4 w-4" />
        {t('documentGenerator.mySavedTemplates')}
      </Button>

      <Dialog open={showTemplatesDialog} onOpenChange={setShowTemplatesDialog}>
        <DialogContent className="sm:max-w-[700px] p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              {t('documentGenerator.mySavedTemplates')}
            </DialogTitle>
          </DialogHeader>
          <UserTemplates onSelectTemplate={handleSelectUserTemplate} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
