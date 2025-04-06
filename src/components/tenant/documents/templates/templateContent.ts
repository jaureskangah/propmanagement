
import type { Tenant } from "@/types/tenant";

export const generateTemplateContent = (template: string, tenant: Tenant): string => {
  switch (template) {
    case "lease":
      return `CONTRAT DE BAIL

Locataire: {{tenant.name}}
Email: {{tenant.email}}
Téléphone: {{tenant.phone}}
Propriété: {{property.name}}
Numéro d'unité: {{tenant.unit_number}}
Date de début: {{tenant.lease_start}}
Date de fin: {{tenant.lease_end}}
Loyer mensuel: {{tenant.rent_amount}}€

[Le reste du contrat peut être édité ici]`;

    case "receipt":
      return `QUITTANCE DE LOYER

Locataire: {{tenant.name}}
Propriété: {{property.name}}
Numéro d'unité: {{tenant.unit_number}}
Montant: {{tenant.rent_amount}}€
Date: {{currentDate}}

[Les détails du paiement peuvent être édités ici]`;

    case "notice":
      return `AVIS DE DÉPART

Date: {{currentDate}}

À: {{tenant.name}}
{{property.name}}
Unité {{tenant.unit_number}}

Cher/Chère {{tenant.name}},

Cette lettre sert d'avis formel vous demandant de quitter les lieux décrits ci-dessus.

Détails du bail actuel:
- Date de début du bail: {{tenant.lease_start}}
- Date de fin du bail: {{tenant.lease_end}}
- Loyer mensuel: {{tenant.rent_amount}}€

Veuillez vous assurer que:
1. Tous les effets personnels sont retirés
2. L'unité est soigneusement nettoyée
3. Toutes les clés sont rendues
4. Une adresse de réexpédition est fournie

[Les conditions générales supplémentaires peuvent être modifiées ici]

Cordialement,
La Gestion Immobilière`;

    default:
      throw new Error("Modèle non implémenté");
  }
};
