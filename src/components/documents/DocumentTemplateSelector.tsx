
import React, { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
  const { t } = useLocale();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showTemplatesDialog, setShowTemplatesDialog] = useState(false);

  const templates = [
    { id: "lease", name: t('documentGenerator.leaseAgreement') || "Contrat de bail" },
    { id: "receipt", name: t('documentGenerator.rentReceipt') || "Quittance de loyer" },
    { id: "notice", name: t('documentGenerator.noticeToVacate') || "Avis de départ" },
    { id: "lease_renewal", name: t('documentGenerator.leaseRenewal') || "Renouvellement de bail" },
    { id: "payment_reminder", name: t('documentGenerator.paymentReminder') || "Rappel de paiement" },
    { id: "late_payment", name: t('documentGenerator.latePaymentNotice') || "Avis de retard de paiement" },
    { id: "entry_notice", name: t('documentGenerator.entryNotice') || "Avis d'entrée" },
    { id: "maintenance_notice", name: t('documentGenerator.maintenanceNotice') || "Avis de maintenance" },
    { id: "move_in_checklist", name: t('documentGenerator.moveInChecklist') || "Liste de contrôle d'entrée" },
    { id: "move_out_checklist", name: t('documentGenerator.moveOutChecklist') || "Liste de contrôle de sortie" },
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
        // Générer le contenu du modèle
        content = generateTemplateContent(selectedTemplate, tenant || undefined);
        
        // Traiter les champs dynamiques dans le contenu si un locataire est fourni
        if (tenant) {
          content = processDynamicFields(content, tenant);
        }
        
        onGenerateContent(content);
        toast({
          title: t('documentGenerator.templateLoaded') || "Modèle chargé",
          description: t('documentGenerator.templateLoadedDescription') || "Le contenu du modèle a été chargé avec succès"
        });
      } catch (error) {
        console.error("Error generating template content:", error);
        toast({
          title: t('documentGenerator.errorTitle') || "Erreur",
          description: t('documentGenerator.templateLoadError') || "Impossible de charger le contenu du modèle",
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
      title: t('documentGenerator.templateLoaded') || "Modèle chargé",
      description: t('documentGenerator.templateLoadedDescription') || "Le contenu du modèle a été chargé avec succès"
    });
  };
  
  return (
    <div className="space-y-4">
      <Select value={selectedTemplate} onValueChange={handleSelectTemplate}>
        <SelectTrigger>
          <SelectValue placeholder={t('documentGenerator.selectDocumentTemplate') || "Sélectionner un modèle de document"} />
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
          (t('documentGenerator.generating') || "Génération...") : 
          (t('documentGenerator.generateDocument') || "Générer un document")
        }
      </Button>
      
      {/* Bouton pour accéder aux modèles sauvegardés */}
      <Button
        onClick={() => setShowTemplatesDialog(true)}
        variant="outline"
        className="w-full"
      >
        <BookmarkCheck className="mr-2 h-4 w-4" />
        {t('documentGenerator.mySavedTemplates') || "Mes modèles enregistrés"}
      </Button>

      {/* Dialogue pour afficher les modèles enregistrés */}
      <Dialog open={showTemplatesDialog} onOpenChange={setShowTemplatesDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <UserTemplates onSelectTemplate={handleSelectUserTemplate} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
