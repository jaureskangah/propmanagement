
import React from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Template } from "../DocumentGeneratorContent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Home, Users, Receipt, FileWarning } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface DocumentTemplatesProps {
  onSelectTemplate: (template: Template) => void;
}

export const DocumentTemplates = ({ onSelectTemplate }: DocumentTemplatesProps) => {
  const { t } = useLocale();
  
  const templates: Template[] = [
    {
      id: "lease",
      name: t('leaseAgreement'),
      category: "property",
      description: t('leaseAgreementDescription'),
      content: generateLeaseTemplate()
    },
    {
      id: "notice",
      name: t('noticeToVacate'),
      category: "property",
      description: t('noticeToVacateDescription'),
      content: generateNoticeTemplate()
    },
    {
      id: "receipt",
      name: t('rentReceipt'),
      category: "payments",
      description: t('rentReceiptDescription'),
      content: generateReceiptTemplate()
    },
    {
      id: "inspection",
      name: t('propertyInspection'),
      category: "property",
      description: t('propertyInspectionDescription'),
      content: generateInspectionTemplate()
    },
    {
      id: "welcome",
      name: t('welcomeLetter'),
      category: "tenant",
      description: t('welcomeLetterDescription'),
      content: generateWelcomeTemplate()
    }
  ];
  
  const categories = {
    property: {
      name: t('property'),
      icon: Home,
      color: "text-blue-600"
    },
    tenant: {
      name: t('tenants'),
      icon: Users,
      color: "text-green-600"
    },
    payments: {
      name: t('payments'),
      icon: Receipt,
      color: "text-purple-600"
    },
    notices: {
      name: t('notices'),
      icon: FileWarning,
      color: "text-amber-600"
    }
  };

  return (
    <ScrollArea className="h-[600px]">
      <Tabs defaultValue="all" className="w-full px-2">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="all">{t('all')}</TabsTrigger>
          <TabsTrigger value="property">{t('property')}</TabsTrigger>
          <TabsTrigger value="tenant">{t('tenant')}</TabsTrigger>
          <TabsTrigger value="payments">{t('payments')}</TabsTrigger>
        </TabsList>
        
        {Object.entries(categories).map(([categoryId, categoryInfo]) => (
          <TabsContent value={categoryId} key={categoryId} className="mt-0 space-y-4">
            <div className="space-y-4 py-2">
              {templates
                .filter(template => template.category === categoryId)
                .map(template => (
                  <TemplateCard 
                    key={template.id} 
                    template={template} 
                    icon={categoryInfo.icon} 
                    iconColor={categoryInfo.color}
                    onSelect={() => onSelectTemplate(template)}
                  />
                ))
              }
            </div>
          </TabsContent>
        ))}
        
        <TabsContent value="all" className="mt-0 space-y-4">
          <div className="space-y-4 py-2">
            {templates.map(template => {
              const categoryInfo = categories[template.category as keyof typeof categories];
              return (
                <TemplateCard 
                  key={template.id} 
                  template={template} 
                  icon={categoryInfo.icon} 
                  iconColor={categoryInfo.color}
                  onSelect={() => onSelectTemplate(template)}
                />
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </ScrollArea>
  );
};

interface TemplateCardProps {
  template: Template;
  icon: React.ElementType;
  iconColor: string;
  onSelect: () => void;
}

const TemplateCard = ({ template, icon: Icon, iconColor, onSelect }: TemplateCardProps) => {
  return (
    <Card 
      className="cursor-pointer hover:border-blue-400 transition-colors"
      onClick={onSelect}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon className={`h-5 w-5 ${iconColor}`} />
            <CardTitle className="text-base">{template.name}</CardTitle>
          </div>
        </div>
        <CardDescription className="text-xs">{template.description}</CardDescription>
      </CardHeader>
    </Card>
  );
};

// Fonctions pour générer le contenu des templates
function generateLeaseTemplate(): string {
  return `# CONTRAT DE LOCATION RÉSIDENTIELLE

**DATE:** [DATE]

**ENTRE:** [NOM DU PROPRIÉTAIRE]
**ET:** [NOM DU LOCATAIRE]

## 1. DESCRIPTION DE LA PROPRIÉTÉ

Adresse: [ADRESSE]
Unité: [NUMÉRO D'UNITÉ]

## 2. DURÉE DU BAIL

Date de début: [DATE DE DÉBUT]
Date de fin: [DATE DE FIN]

## 3. LOYER

Montant mensuel: [MONTANT] €
Date d'échéance: Le [JOUR] de chaque mois

## 4. DÉPÔT DE GARANTIE

Montant: [MONTANT] €

## 5. CONDITIONS GÉNÉRALES

Le locataire accepte de se conformer à toutes les règles et réglementations de la propriété.`;
}

function generateNoticeTemplate(): string {
  return `# AVIS DE DÉPART

**DATE:** [DATE]

**À:** [NOM DU LOCATAIRE]
**ADRESSE:** [ADRESSE]
**UNITÉ:** [NUMÉRO D'UNITÉ]

Par la présente, nous vous informons que votre contrat de location prendra fin le [DATE DE FIN].

Veuillez libérer les lieux et remettre toutes les clés au plus tard à cette date.

Cordialement,
[NOM DU PROPRIÉTAIRE]`;
}

function generateReceiptTemplate(): string {
  return `# REÇU DE PAIEMENT DE LOYER

**DATE:** [DATE]

**REÇU DE:** [NOM DU LOCATAIRE]
**POUR LA PROPRIÉTÉ:** [ADRESSE], Unité [NUMÉRO D'UNITÉ]

**MONTANT REÇU:** [MONTANT] €
**PÉRIODE DE LOCATION:** [MOIS/ANNÉE]
**MODE DE PAIEMENT:** [MODE DE PAIEMENT]

Ce document constitue un reçu officiel pour le paiement du loyer mentionné ci-dessus.

[NOM DU PROPRIÉTAIRE]
[SIGNATURE]`;
}

function generateInspectionTemplate(): string {
  return `# RAPPORT D'INSPECTION DE PROPRIÉTÉ

**DATE DE L'INSPECTION:** [DATE]
**ADRESSE:** [ADRESSE]
**UNITÉ:** [NUMÉRO D'UNITÉ]
**LOCATAIRE:** [NOM DU LOCATAIRE]

## ÉTAT DES LIEUX

### Salon
- Murs: [ÉTAT]
- Sol: [ÉTAT]
- Éclairage: [ÉTAT]

### Cuisine
- Appareils: [ÉTAT]
- Armoires: [ÉTAT]
- Évier: [ÉTAT]

### Salle de bain
- Sanitaires: [ÉTAT]
- Douche/Baignoire: [ÉTAT]
- Lavabo: [ÉTAT]

## REMARQUES SUPPLÉMENTAIRES
[REMARQUES]

## SIGNATURES
Inspecteur: _________________________
Locataire: _________________________`;
}

function generateWelcomeTemplate(): string {
  return `# LETTRE DE BIENVENUE

**DATE:** [DATE]

Cher/Chère [NOM DU LOCATAIRE],

Nous sommes ravis de vous accueillir dans votre nouvelle résidence à [ADRESSE], Unité [NUMÉRO D'UNITÉ].

## INFORMATIONS IMPORTANTES

- **Service de maintenance:** [CONTACT]
- **Urgences:** [CONTACT]
- **Heures de bureau:** [HEURES]

N'hésitez pas à nous contacter si vous avez des questions ou des préoccupations.

Cordialement,
[NOM DU PROPRIÉTAIRE]`;
}
