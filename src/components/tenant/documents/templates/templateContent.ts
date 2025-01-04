import type { Tenant } from "@/types/tenant";

export const generateTemplateContent = (template: string, tenant: Tenant): string => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  switch (template) {
    case "lease":
      return `CONTRAT DE LOCATION

Date: ${new Date().toLocaleDateString('fr-FR')}

INFORMATIONS DU LOCATAIRE
------------------------
Nom: ${tenant.name}
Email: ${tenant.email}
Téléphone: ${tenant.phone || 'Non renseigné'}

INFORMATIONS DE LA PROPRIÉTÉ
---------------------------
Propriété: ${tenant.properties?.name || 'Non spécifié'}
Numéro d'unité: ${tenant.unit_number}

DÉTAILS DU BAIL
--------------
Date de début: ${formatDate(tenant.lease_start)}
Date de fin: ${formatDate(tenant.lease_end)}
Loyer mensuel: ${tenant.rent_amount}€

CONDITIONS GÉNÉRALES
------------------
1. Durée du bail
   Le présent bail est conclu pour une durée déterminée, commençant le ${formatDate(tenant.lease_start)} et se terminant le ${formatDate(tenant.lease_end)}.

2. Loyer et Paiement
   Le loyer mensuel est fixé à ${tenant.rent_amount}€, payable d'avance le premier jour de chaque mois.

3. Dépôt de garantie
   Un dépôt de garantie équivalent à un mois de loyer sera versé à la signature du bail.

4. Entretien et Réparations
   Le locataire s'engage à maintenir le logement en bon état et à signaler toute réparation nécessaire.

5. Résiliation
   Le préavis de départ est de 3 mois, à notifier par lettre recommandée avec accusé de réception.`;

    case "receipt":
      return `REÇU DE LOYER

Date d'émission: ${new Date().toLocaleDateString('fr-FR')}

BAILLEUR
--------
Property Management System

LOCATAIRE
---------
Nom: ${tenant.name}
Adresse: ${tenant.properties?.name || 'Non spécifié'}
Unité: ${tenant.unit_number}

PAIEMENT
--------
Montant: ${tenant.rent_amount}€
Période: ${new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}

Ce document certifie le paiement du loyer pour la période mentionnée ci-dessus.`;

    case "notice":
      return `AVIS DE DÉPART

Date: ${new Date().toLocaleDateString('fr-FR')}

DESTINATAIRE
-----------
${tenant.name}
${tenant.properties?.name || 'Adresse de la propriété'}
Unité ${tenant.unit_number}

Cher/Chère ${tenant.name},

Par la présente, nous vous informons de la fin prochaine de votre bail.

INFORMATIONS DU BAIL
-------------------
Date de début: ${formatDate(tenant.lease_start)}
Date de fin: ${formatDate(tenant.lease_end)}
Loyer mensuel: ${tenant.rent_amount}€

INSTRUCTIONS DE DÉPART
--------------------
1. Retrait des effets personnels
2. Nettoyage complet de l'unité
3. Remise des clés
4. Fourniture d'une adresse de réexpédition

Nous vous remercions de votre location et vous souhaitons le meilleur pour la suite.

Cordialement,
Property Management System`;

    default:
      throw new Error("Template non implémenté");
  }
};