
import React, { useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, FileCheck } from "lucide-react";
import { Tenant } from "@/types/tenant";
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
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState("standard");
  
  const handleSelectUserTemplate = (template: DocumentTemplate) => {
    onSelectTemplate(template.id, template.name);
    onGenerateContent(template.content);
  };
  
  // Standard templates
  const templates = [
    {
      id: "lease-agreement",
      name: t('documentGenerator.leaseAgreement'),
      category: "lease",
      description: t('documentGenerator.leaseAgreement')
    },
    {
      id: "lease-renewal",
      name: t('documentGenerator.leaseRenewal'),
      category: "lease",
      description: t('documentGenerator.leaseRenewal')
    },
    {
      id: "lease-termination",
      name: t('documentGenerator.leaseTermination'),
      category: "lease",
      description: t('documentGenerator.leaseTermination')
    },
    {
      id: "rent-receipt",
      name: t('documentGenerator.rentReceipt'),
      category: "payment",
      description: t('documentGenerator.rentReceipt')
    },
    {
      id: "payment-reminder",
      name: t('documentGenerator.paymentReminder'),
      category: "payment",
      description: t('documentGenerator.paymentReminder')
    },
    {
      id: "notice-to-vacate",
      name: t('documentGenerator.noticeToVacate'),
      category: "notice",
      description: t('documentGenerator.noticeToVacate')
    },
    {
      id: "entry-notice",
      name: t('documentGenerator.entryNotice'),
      category: "notice",
      description: t('documentGenerator.entryNotice')
    },
    {
      id: "inspection-report",
      name: t('documentGenerator.inspectionReport'),
      category: "inspection",
      description: t('documentGenerator.inspectionReport')
    },
    {
      id: "custom-document",
      name: t('documentGenerator.customDocument'),
      category: "custom",
      description: t('documentGenerator.customDocument')
    }
  ];

  const handleTemplateClick = (templateId: string, templateName: string) => {
    if (templateId === selectedTemplate) return;
    
    onSelectTemplate(templateId, templateName);
    setIsGenerating(true);
    
    // Content for selected template
    let content = "";
    
    switch(templateId) {
      case "lease-agreement":
        content = t('documentGenerator.leaseAgreementContent') || "";
        break;
      case "lease-renewal":
        content = t('documentGenerator.leaseRenewalContent') || "";
        break;
      case "rent-receipt":
        content = t('documentGenerator.rentReceiptContent') || "";
        break;
      case "custom-document":
        content = "# " + t('documentGenerator.customDocument') + "\n\n";
        break;
      default:
        content = "# " + templateName + "\n\n";
    }
    
    // Process tenant variables in content if tenant data is available
    if (tenant) {
      content = content.replace(/\[Tenant Name\]/g, tenant.name || "");
      content = content.replace(/\[tenant\.name\]/g, tenant.name || "");
      content = content.replace(/\[tenant\.email\]/g, tenant.email || "");
      content = content.replace(/\[Property Address\]/g, tenant.property_id || "");
      content = content.replace(/\[Unit\]/g, tenant.unit_number || "");
      content = content.replace(/\[Rent Amount\]/g, tenant.rent_amount?.toString() || "");
    }
    
    setTimeout(() => {
      onGenerateContent(content);
      setIsGenerating(false);
    }, 500);
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="standard" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          {t('documentGenerator.standardTemplates') || "Standard Templates"}
        </TabsTrigger>
        <TabsTrigger value="custom" className="flex items-center gap-2">
          <FileCheck className="h-4 w-4" />
          {t('documentGenerator.myTemplates') || "My Templates"}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="standard" className="pt-4">
        <ScrollArea className="h-[450px] pr-4">
          <div className="space-y-2">
            {templates.map((template) => (
              <button
                key={template.id}
                className={`w-full p-3 text-left rounded-md transition-colors ${
                  template.id === selectedTemplate 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-card hover:bg-accent"
                } border`}
                onClick={() => handleTemplateClick(template.id, template.name)}
              >
                <div className="font-medium">{template.name}</div>
                <div className="text-xs opacity-80">{template.description}</div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </TabsContent>
      
      <TabsContent value="custom" className="pt-4">
        <UserTemplates onSelectTemplate={handleSelectUserTemplate} />
      </TabsContent>
    </Tabs>
  );
}
