
import type { Tenant } from "@/types/tenant";

export const generateTemplateContent = (template: string, tenant?: Tenant): string => {
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
________________________________

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
________________________________

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
