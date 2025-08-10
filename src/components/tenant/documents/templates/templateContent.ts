
import type { Tenant } from "@/types/tenant";

export const generateTemplateContent = (template: string, tenant?: Tenant, language: 'en' | 'fr' = 'fr'): string => {
  // Return content based on selected language
  if (language === 'en') {
    switch (template) {
      case "lease":
        return `LEASE AGREEMENT

Tenant: {{name}}
Email: {{email}}
Phone: {{phone}}
Property: {{properties.name}}
Unit Number: {{unit_number}}
Start Date: {{lease_start}}
End Date: {{lease_end}}
Monthly Rent: {{rent_amount}}

This LEASE AGREEMENT is made on {{currentDate}} between the Landlord and the Tenant.

1. PREMISES
   The Landlord agrees to rent to the Tenant the premises located at {{properties.name}}, Unit {{unit_number}}.

2. TERM
   The term of this lease begins on {{lease_start}} and ends on {{lease_end}}.

3. RENT
   The monthly rent for the premises is {{rent_amount}}, due on the first day of each month.

4. SECURITY DEPOSIT
   The Tenant shall pay a security deposit of ________ at the signing of this agreement.

5. UTILITIES
   The Tenant is responsible for payment of all utilities, except:
   _______________________________________

6. MAINTENANCE
   The Tenant agrees to keep the premises clean and sanitary and promptly notify the Landlord of any defects or maintenance issues.

[Additional conditions may be added here]

Landlord: _________________________     Date: _____________

Tenant: __________________________     Date: _____________`;

      case "receipt":
        return `RENT RECEIPT

Tenant: {{name}}
Property: {{properties.name}}
Unit Number: {{unit_number}}
Amount: {{rent_amount}}
Date: {{currentDate}}

This document certifies that the landlord has received a payment from {{name}} in the amount of {{rent_amount}} representing the monthly rent for the property located at {{properties.name}}, Unit {{unit_number}}.

Payment Method: ________________
Payment Period: ________________

Landlord's Signature: _________________________

Thank you for your payment!`;

      case "notice":
        return `NOTICE TO VACATE

Date: {{currentDate}}

To: {{name}}
{{properties.name}}
Unit {{unit_number}}

Dear {{name}},

This letter serves as formal notice that you are required to vacate the premises described above.

Current Lease Details:
- Lease start date: {{lease_start}}
- Lease end date: {{lease_end}}
- Monthly rent: {{rent_amount}}

Please ensure that:
1. All personal belongings are removed
2. The unit is thoroughly cleaned
3. All keys are returned
4. A forwarding address is provided

Reason for notice: ________________________

Move-out date: ________________________

Sincerely,
Management`;

      case "lease_renewal":
        return `LEASE RENEWAL NOTICE

Date: {{currentDate}}

Tenant: {{name}}
Property: {{properties.name}}
Unit Number: {{unit_number}}

Dear {{name}},

We are writing regarding the renewal of your lease for Unit {{unit_number}} at {{properties.name}}.

Your current lease ends on {{lease_end}}. We are pleased to offer a renewal under the following terms:

1. NEW TERM
   The new lease term will begin on ________________ and end on ________________.

2. RENT
   The new monthly rent will be ________________, which is an increase of ________________ from the current rent.

3. OTHER TERMS
   All other terms of your current lease will remain unchanged unless otherwise stated below:
   ________________
   ________________

Please inform us of your decision to renew or not by ________________.

Sincerely,
Management`;

      case "payment_reminder":
        return `PAYMENT REMINDER

Date: {{currentDate}}

To: {{name}}
{{properties.name}}
Unit {{unit_number}}

Subject: Rent payment reminder

Dear {{name}},

This is a friendly reminder that your rent payment in the amount of {{rent_amount}} is due on ________________.

If you have already made the payment, please disregard this reminder and thank you.

If you have not yet paid, please make your payment as soon as possible to avoid late fees.

Accepted payment methods:
- Bank transfer
- Check
- Online payment

If you are experiencing difficulties making your payment on time or have questions, please contact us.

Sincerely,
Management`;

      case "late_payment":
        return `LATE PAYMENT NOTICE

Date: {{currentDate}}

To: {{name}}
{{properties.name}}
Unit {{unit_number}}

LATE PAYMENT NOTICE

Dear {{name}},

According to our records, we have not received your rent payment in the amount of {{rent_amount}} which was due on ________________.

Your payment is currently ________________ days late.

In accordance with your lease agreement, a late fee of ________________ has been added to your balance, bringing the total amount due to ________________.

Please make this payment immediately to avoid further penalties or actions.

If you have already made the payment, please contact us with proof of payment.

Sincerely,
Management`;

      case "entry_notice":
        return `ENTRY NOTICE

Date: {{currentDate}}

To: {{name}}
{{properties.name}}
Unit {{unit_number}}

Dear {{name}},

This is a formal notice to inform you that we need access to your unit for the following reason:

Reason: ________________________________
_______________________________

Planned entry date: ________________
Time: from ________________ to ________________

In accordance with residential tenancy laws, we are providing this notice at least 24 hours before the planned entry.

If this date/time is not convenient for you, please contact us as soon as possible to arrange another time.

Sincerely,
Management`;

      case "maintenance_notice":
        return `MAINTENANCE NOTICE

Date: {{currentDate}}

To: {{name}}
{{properties.name}}
Unit {{unit_number}}

Dear {{name}},

We are informing you that maintenance work is scheduled in your building/unit.

Work description: ________________________________
_______________________________

Planned date and time: ________________ from ________________ to ________________

Expected impact:
- Water interruption: Yes □ No □ Estimated duration: ________________
- Power interruption: Yes □ No □ Estimated duration: ________________
- Noise: Minimal □ Moderate □ Significant □
- Unit access required: Yes □ No □

We will strive to minimize inconvenience during these necessary works. If you have any concerns, please contact us.

Sincerely,
Maintenance Team`;

      case "move_in_checklist":
        return `MOVE-IN CHECKLIST

Tenant: {{name}}
Property: {{properties.name}}
Unit: {{unit_number}}
Move-in Date: {{lease_start}}
Inspection Date: {{currentDate}}

Instructions: Indicate the condition of each item (Excellent, Good, Fair, Poor) and any relevant comments.

LIVING ROOM:
- Walls & ceiling: __________ Comments: __________
- Floor/carpet: __________ Comments: __________
- Windows & blinds: __________ Comments: __________
- Lighting: __________ Comments: __________
- Electrical outlets: __________ Comments: __________

KITCHEN:
- Appliances: __________ Comments: __________
- Cabinets & countertops: __________ Comments: __________
- Sink & faucets: __________ Comments: __________
- Floor: __________ Comments: __________

BATHROOM(S):
- Toilet: __________ Comments: __________
- Tub/Shower: __________ Comments: __________
- Sink & faucets: __________ Comments: __________
- Floor: __________ Comments: __________

BEDROOM(S):
- Walls & ceiling: __________ Comments: __________
- Floor/carpet: __________ Comments: __________
- Closets: __________ Comments: __________
- Windows & blinds: __________ Comments: __________

OTHER:
- Smoke/CO detectors: __________ Comments: __________
- Heating/AC systems: __________ Comments: __________
- Keys provided: __________ Comments: __________

Tenant signature: _________________________ Date: _________________

Landlord/Manager signature: _________________________ Date: _________________`;

      case "move_out_checklist":
        return `MOVE-OUT CHECKLIST

Tenant: {{name}}
Property: {{properties.name}}
Unit: {{unit_number}}
Move-out Date: ________________
Inspection Date: {{currentDate}}

Instructions: Compare current condition with the move-in checklist. Note any damage beyond normal wear and tear.

LIVING ROOM:
- Walls & ceiling: __________ Damage: __________
- Floor/carpet: __________ Damage: __________
- Windows & blinds: __________ Damage: __________
- Lighting: __________ Damage: __________
- Electrical outlets: __________ Damage: __________

KITCHEN:
- Appliances: __________ Damage: __________
- Cabinets & countertops: __________ Damage: __________
- Sink & faucets: __________ Damage: __________
- Floor: __________ Damage: __________

BATHROOM(S):
- Toilet: __________ Damage: __________
- Tub/Shower: __________ Damage: __________
- Sink & faucets: __________ Damage: __________
- Floor: __________ Damage: __________

BEDROOM(S):
- Walls & ceiling: __________ Damage: __________
- Floor/carpet: __________ Damage: __________
- Closets: __________ Damage: __________
- Windows & blinds: __________ Damage: __________

Cleaning condition: Excellent □ Good □ Fair □ Unsatisfactory □

SECURITY DEPOSIT CALCULATION:
- Initial deposit: __________
- Deductions for damages: __________
- Deductions for cleaning: __________
- Other deductions: __________
- Amount refunded: __________

Refund address: __________________________________________

Tenant signature: _________________________ Date: _________________

Landlord/Manager signature: _________________________ Date: _________________`;

      default:
        throw new Error("Template not implemented");
    }
  }

  // Default FR content (existing)
  switch (template) {
    case "lease":
      return `CONTRAT DE BAIL

Locataire: {{name}}
Email: {{email}}
Téléphone: {{phone}}
Propriété: {{properties.name}}
Numéro d'unité: {{unit_number}}
Date de début: {{lease_start}}
Date de fin: {{lease_end}}
Loyer mensuel: {{rent_amount}}€

Ce CONTRAT DE BAIL est établi le {{currentDate}} entre le Propriétaire et le Locataire.

1. LOCAUX
   Le Propriétaire accepte de louer au Locataire le logement situé à {{properties.name}}, Unité {{unit_number}}.

2. DURÉE
   La durée du présent bail commence le {{lease_start}} et se termine le {{lease_end}}.

3. LOYER
   Le loyer mensuel des locaux est de {{rent_amount}}€ exigible le premier jour de chaque mois.

4. DÉPÔT DE GARANTIE
   Le locataire versera un dépôt de garantie de ________ € à la signature du présent contrat.

5. SERVICES PUBLICS
   Le locataire est responsable du paiement de tous les services publics, à l'exception de:
   _______________________________________

6. ENTRETIEN
   Le locataire s'engage à maintenir les locaux dans un état propre et sanitaire et à informer immédiatement le propriétaire de tout défaut ou problème d'entretien.

[Des conditions supplémentaires peuvent être ajoutées ici]

Propriétaire: _________________________     Date: _____________

Locataire: __________________________     Date: _____________`;

    case "receipt":
      return `QUITTANCE DE LOYER

Locataire: {{name}}
Propriété: {{properties.name}}
Numéro d'unité: {{unit_number}}
Montant: {{rent_amount}}€
Date: {{currentDate}}

Ce document certifie que le propriétaire a reçu un paiement de {{name}} pour un montant de {{rent_amount}}€ représentant le loyer mensuel pour la propriété située à {{properties.name}}, Unité {{unit_number}}.

Mode de paiement: ________________
Période de paiement: ________________

Signature du propriétaire: _________________________

Merci pour votre paiement!`;

    case "notice":
      return `AVIS DE DÉPART

Date: {{currentDate}}

À: {{name}}
{{properties.name}}
Unité {{unit_number}}

Cher/Chère {{name}},

Cette lettre sert d'avis formel que vous devez quitter les locaux décrits ci-dessus.

Détails du bail actuel:
- Date de début du bail: {{lease_start}}
- Date de fin du bail: {{lease_end}}
- Loyer mensuel: {{rent_amount}}€

Veuillez vous assurer que:
1. Tous les effets personnels sont retirés
2. L'unité est nettoyée à fond
3. Toutes les clés sont rendues
4. Une adresse de réexpédition est fournie

Raison de l'avis: ________________________

Date de départ: ________________________

Cordialement,
La Direction`;

    case "lease_renewal":
      return `RENOUVELLEMENT DE BAIL

Date: {{currentDate}}

Locataire: {{name}}
Propriété: {{properties.name}}
Numéro d'unité: {{unit_number}}

Cher/Chère {{name}},

Nous vous écrivons concernant le renouvellement de votre bail pour l'unité {{unit_number}} à {{properties.name}}.

Votre bail actuel prend fin le {{lease_end}}. Nous sommes heureux de vous proposer un renouvellement aux conditions suivantes:

1. NOUVELLE DURÉE
   La nouvelle durée du bail commencera le ________________ et se terminera le ________________.

2. LOYER
   Le nouveau loyer mensuel sera de ________________€, soit une augmentation de ________________€ par rapport au loyer actuel.

3. AUTRES CONDITIONS
   Toutes les autres conditions de votre bail actuel resteront inchangées, sauf indication contraire ci-dessous:
   ________________
   ________________

Veuillez nous informer de votre décision de renouveler ou non votre bail avant le ________________.

Cordialement,
La Direction`;

    case "payment_reminder":
      return `RAPPEL DE PAIEMENT

Date: {{currentDate}}

À: {{name}}
{{properties.name}}
Unité {{unit_number}}

Objet: Rappel de paiement de loyer

Cher/Chère {{name}},

Ce message est un rappel amical que votre paiement de loyer d'un montant de {{rent_amount}}€ est dû le ________________.

Si vous avez déjà effectué le paiement, veuillez ignorer ce rappel et nous vous remercions.

Si vous n'avez pas encore payé, veuillez effectuer votre paiement dès que possible pour éviter des frais de retard.

Méthodes de paiement acceptées:
- Virement bancaire
- Chèque
- Paiement en ligne

Si vous rencontrez des difficultés pour effectuer votre paiement à temps ou si vous avez des questions, n'hésitez pas à nous contacter.

Cordialement,
La Direction`;

    case "late_payment":
      return `AVIS DE RETARD DE PAIEMENT

Date: {{currentDate}}

À: {{name}}
{{properties.name}}
Unité {{unit_number}}

AVIS DE RETARD DE PAIEMENT

Cher/Chère {{name}},

Selon nos dossiers, nous n'avons pas reçu votre paiement de loyer d'un montant de {{rent_amount}}€ qui était dû le ________________.

Votre paiement est actuellement en retard de ________________ jours.

Conformément à votre contrat de bail, des frais de retard de ________________€ ont été ajoutés à votre solde, ce qui porte le montant total dû à ________________€.

Veuillez effectuer ce paiement immédiatement pour éviter d'autres pénalités ou actions.

Si vous avez déjà effectué le paiement, veuillez nous contacter avec la preuve de paiement.

Cordialement,
La Direction`;

    case "entry_notice":
      return `AVIS D'ENTRÉE

Date: {{currentDate}}

À: {{name}}
{{properties.name}}
Unité {{unit_number}}

Cher/Chère {{name}},

Ceci est un avis formel pour vous informer que nous avons besoin d'accéder à votre unité pour la raison suivante:

Raison: ________________________________
______________________________

Date d'entrée prévue: ________________
Heure: de ________________ à ________________

Conformément aux lois sur la location résidentielle, nous vous fournissons cet avis au moins 24 heures avant l'entrée prévue.

Si cette date/heure ne vous convient pas, veuillez nous contacter dès que possible pour prévoir un autre moment.

Cordialement,
La Direction`;

    case "maintenance_notice":
      return `AVIS DE MAINTENANCE

Date: {{currentDate}}

À: {{name}}
{{properties.name}}
Unité {{unit_number}}

Cher/Chère {{name}},

Nous vous informons que des travaux de maintenance sont prévus dans votre bâtiment/unité.

Description des travaux: ________________________________
_______________________________

Date et heure prévues: ________________ de ________________ à ________________

Impact prévu:
- Interruption d'eau: Oui □ Non □ Durée estimée: ________________
- Interruption d'électricité: Oui □ Non □ Durée estimée: ________________
- Bruit: Minime □ Modéré □ Significatif □
- Accès à l'unité requis: Oui □ Non □

Nous nous efforçons de minimiser les désagréments pendant ces travaux nécessaires. Si vous avez des préoccupations particulières, veuillez nous contacter.

Cordialement,
L'équipe de maintenance`;

    case "move_in_checklist":
      return `LISTE DE CONTRÔLE D'ENTRÉE

Locataire: {{name}}
Propriété: {{properties.name}}
Unité: {{unit_number}}
Date d'emménagement: {{lease_start}}
Date d'inspection: {{currentDate}}

Instructions: Indiquez l'état de chaque élément (Excellent, Bon, Moyen, Mauvais) et tout commentaire pertinent.

SALON:
- Murs & plafond: __________ Commentaires: __________
- Sol/tapis: __________ Commentaires: __________
- Fenêtres & stores: __________ Commentaires: __________
- Éclairage: __________ Commentaires: __________
- Prises électriques: __________ Commentaires: __________

CUISINE:
- Appareils électroménagers: __________ Commentaires: __________
- Armoires & comptoirs: __________ Commentaires: __________
- Évier & robinets: __________ Commentaires: __________
- Sol: __________ Commentaires: __________

SALLE(S) DE BAIN:
- Toilettes: __________ Commentaires: __________
- Baignoire/Douche: __________ Commentaires: __________
- Lavabo & robinets: __________ Commentaires: __________
- Sol: __________ Commentaires: __________

CHAMBRE(S):
- Murs & plafond: __________ Commentaires: __________
- Sol/tapis: __________ Commentaires: __________
- Placards: __________ Commentaires: __________
- Fenêtres & stores: __________ Commentaires: __________

AUTRES:
- Détecteurs de fumée/CO: __________ Commentaires: __________
- Systèmes de chauffage/climatisation: __________ Commentaires: __________
- Clés remises: __________ Commentaires: __________

Signature du locataire: _________________________ Date: _________________

Signature du propriétaire/gestionnaire: _________________________ Date: _________________`;

    case "move_out_checklist":
      return `LISTE DE CONTRÔLE DE SORTIE

Locataire: {{name}}
Propriété: {{properties.name}}
Unité: {{unit_number}}
Date de déménagement: ________________
Date d'inspection: {{currentDate}}

Instructions: Comparez l'état actuel avec la liste d'entrée. Notez tout dommage au-delà de l'usure normale.

SALON:
- Murs & plafond: __________ Dommages: __________
- Sol/tapis: __________ Dommages: __________
- Fenêtres & stores: __________ Dommages: __________
- Éclairage: __________ Dommages: __________
- Prises électriques: __________ Dommages: __________

CUISINE:
- Appareils électroménagers: __________ Dommages: __________
- Armoires & comptoirs: __________ Dommages: __________
- Évier & robinets: __________ Dommages: __________
- Sol: __________ Dommages: __________

SALLE(S) DE BAIN:
- Toilettes: __________ Dommages: __________
- Baignoire/Douche: __________ Dommages: __________
- Lavabo & robinets: __________ Dommages: __________
- Sol: __________ Dommages: __________

CHAMBRE(S):
- Murs & plafond: __________ Dommages: __________
- Sol/tapis: __________ Dommages: __________
- Placards: __________ Dommages: __________
- Fenêtres & stores: __________ Dommages: __________

État de nettoyage: Excellent □ Bon □ Moyen □ Insatisfaisant □

CALCUL DU DÉPÔT DE GARANTIE:
- Dépôt initial: __________€
- Déductions pour dommages: __________€
- Déductions pour nettoyage: __________€
- Autres déductions: __________€
- Montant remboursé: __________€

Adresse de remboursement: __________________________________________

Signature du locataire: _________________________ Date: _________________

Signature du propriétaire/gestionnaire: _________________________ Date: _________________`;

    default:
      throw new Error("Template not implemented");
  }
};
