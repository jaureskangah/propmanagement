
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/components/providers/LocaleProvider";
import { 
  FileText, 
  Receipt, 
  FileWarning,
  FileCheck,
  FileCog,
  ChevronRight
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface DocumentTemplateSelectorProps {
  selectedTemplate: string;
  onSelectTemplate: (template: string) => void;
  onGenerateContent: (content: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
}

export function DocumentTemplateSelector({
  selectedTemplate,
  onSelectTemplate,
  onGenerateContent,
  setIsGenerating
}: DocumentTemplateSelectorProps) {
  const { t } = useLocale();
  const { toast } = useToast();
  const [openCategory, setOpenCategory] = useState<string>("lease");

  const documentCategories = [
    {
      id: "lease",
      name: t('leaseDocuments'),
      icon: FileText,
      templates: [
        { id: "lease_agreement", name: t('leaseAgreement') },
        { id: "lease_renewal", name: t('leaseRenewal') },
        { id: "lease_termination", name: t('leaseTermination') }
      ]
    },
    {
      id: "payment",
      name: t('paymentDocuments'),
      icon: Receipt,
      templates: [
        { id: "rent_receipt", name: t('rentReceipt') },
        { id: "payment_reminder", name: t('paymentReminder') },
        { id: "late_payment_notice", name: t('latePaymentNotice') }
      ]
    },
    {
      id: "notice",
      name: t('noticeDocuments'),
      icon: FileWarning,
      templates: [
        { id: "notice_to_vacate", name: t('noticeToVacate') },
        { id: "entry_notice", name: t('entryNotice') },
        { id: "maintenance_notice", name: t('maintenanceNotice') }
      ]
    },
    {
      id: "inspection",
      name: t('inspectionDocuments'),
      icon: FileCheck,
      templates: [
        { id: "move_in_checklist", name: t('moveInChecklist') },
        { id: "move_out_checklist", name: t('moveOutChecklist') },
        { id: "inspection_report", name: t('inspectionReport') }
      ]
    },
    {
      id: "misc",
      name: t('miscDocuments'),
      icon: FileCog,
      templates: [
        { id: "tenant_complaint", name: t('tenantComplaint') },
        { id: "property_rules", name: t('propertyRules') }
      ]
    }
  ];

  const handleTemplateClick = (templateId: string) => {
    setIsGenerating(true);
    onSelectTemplate(templateId);
    
    // Generate dummy content based on template
    const dummyContent = generateDummyContent(templateId);
    
    setTimeout(() => {
      onGenerateContent(dummyContent);
      setIsGenerating(false);
      toast({
        title: t('templateLoaded'),
        description: t('templateLoadedDescription')
      });
    }, 800);
  };

  const generateDummyContent = (templateId: string): string => {
    // This would be replaced with actual template content logic
    const templates: Record<string, string> = {
      lease_agreement: `# ${t('leaseAgreement')}\n\n${t('leaseAgreementContent')}`,
      lease_renewal: `# ${t('leaseRenewal')}\n\n${t('leaseRenewalContent')}`,
      lease_termination: `# ${t('leaseTermination')}\n\n${t('leaseTerminationContent')}`,
      rent_receipt: `# ${t('rentReceipt')}\n\n${t('rentReceiptContent')}`,
      payment_reminder: `# ${t('paymentReminder')}\n\n${t('paymentReminderContent')}`,
      late_payment_notice: `# ${t('latePaymentNotice')}\n\n${t('latePaymentNoticeContent')}`,
      notice_to_vacate: `# ${t('noticeToVacate')}\n\n${t('noticeToVacateContent')}`,
      entry_notice: `# ${t('entryNotice')}\n\n${t('entryNoticeContent')}`,
      maintenance_notice: `# ${t('maintenanceNotice')}\n\n${t('maintenanceNoticeContent')}`,
      move_in_checklist: `# ${t('moveInChecklist')}\n\n${t('moveInChecklistContent')}`,
      move_out_checklist: `# ${t('moveOutChecklist')}\n\n${t('moveOutChecklistContent')}`,
      inspection_report: `# ${t('inspectionReport')}\n\n${t('inspectionReportContent')}`,
      tenant_complaint: `# ${t('tenantComplaint')}\n\n${t('tenantComplaintContent')}`,
      property_rules: `# ${t('propertyRules')}\n\n${t('propertyRulesContent')}`,
    };
    
    return templates[templateId] || `# ${t('customDocument')}\n\n${t('customDocumentContent')}`;
  };

  return (
    <div className="space-y-4">
      <Accordion
        type="single"
        collapsible
        value={openCategory}
        onValueChange={setOpenCategory}
        className="w-full"
      >
        {documentCategories.map((category) => (
          <AccordionItem key={category.id} value={category.id}>
            <AccordionTrigger className="hover:bg-muted/50 px-2 rounded-md">
              <div className="flex items-center gap-2">
                <category.icon className="h-4 w-4 text-muted-foreground" />
                <span>{category.name}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-6 space-y-1 py-2">
                {category.templates.map((template) => (
                  <Button
                    key={template.id}
                    variant={selectedTemplate === template.id ? "secondary" : "ghost"}
                    className={`w-full justify-start ${
                      selectedTemplate === template.id ? "bg-secondary/20" : ""
                    }`}
                    onClick={() => handleTemplateClick(template.id)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{template.name}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
