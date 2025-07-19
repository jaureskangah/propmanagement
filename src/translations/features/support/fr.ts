import type { SupportTranslations } from '../../types/support';

export const frSupport: SupportTranslations = {
  // Header
  title: "Centre de Support",
  subtitle: "Comment pouvons-nous vous aider aujourd'hui ?",
  backToDashboard: "Retour au tableau de bord",

  // Search
  searchPlaceholder: "Rechercher dans l'aide...",

  // Support Options
  chatTitle: "Chat en direct",
  chatDescription: "Obtenez une aide immédiate de notre équipe",
  emailTitle: "Support par email",
  emailDescription: "Envoyez-nous un message détaillé",
  phoneTitle: "Support téléphonique",
  phoneDescription: "Appelez-nous directement",
  docsTitle: "Documentation",
  docsDescription: "Consultez nos guides et tutoriels",
  available: "Disponible",

  // Quick Help
  quickHelpTitle: "Aide rapide",
  quickHelpDescription: "Articles les plus consultés",
  quickHelp: {
    createProperty: "Comment créer une propriété",
    addTenants: "Ajouter des locataires",
    managePayments: "Gérer les paiements",
    scheduleMaintenance: "Planifier la maintenance"
  },
  timeLabels: {
    min1: "1 min",
    min2: "2 min",
    min3: "3 min"
  },
  categories: {
    start: "Démarrage",
    management: "Gestion",
    finance: "Finance",
    maintenance: "Maintenance"
  },

  // System Status
  systemStatusTitle: "État du système",
  systemStatusDescription: "Tous les services sont opérationnels",
  operational: "Opérationnel",
  services: {
    api: "API PropManagement",
    email: "Service Email",
    database: "Base de données"
  },
  lastCheckLabels: {
    seconds30: "Il y a 30 secondes",
    minute1: "Il y a 1 minute",
    minutes2: "Il y a 2 minutes"
  },

  // Contact Information
  additionalHelpTitle: "Besoin d'aide supplémentaire ?",
  additionalHelpDescription: "Notre équipe est disponible du lundi au vendredi, de 9h à 17h"
};