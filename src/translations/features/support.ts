import { SupportTranslations } from '../types/support';

export const supportTranslations: Record<'en' | 'fr', SupportTranslations> = {
  fr: {
    title: "Centre de Support",
    subtitle: "Comment pouvons-nous vous aider aujourd'hui ?",
    backToDashboard: "Retour au tableau de bord",
    searchPlaceholder: "Rechercher dans l'aide...",
    supportOptions: {
      chat: {
        title: "Chat en direct",
        description: "Obtenez une aide immédiate de notre équipe"
      },
      email: {
        title: "Support par email",
        description: "Envoyez-nous un message détaillé"
      },
      phone: {
        title: "Support téléphonique",
        description: "Appelez-nous directement"
      },
      docs: {
        title: "Documentation",
        description: "Consultez nos guides et tutoriels"
      }
    },
    quickHelp: {
      title: "Aide rapide",
      subtitle: "Articles les plus consultés",
      articles: {
        createProperty: "Comment créer une propriété",
        addTenants: "Ajouter des locataires",
        managePayments: "Gérer les paiements",
        scheduleMaintenance: "Planifier la maintenance"
      },
      categories: {
        getting_started: "Démarrage",
        management: "Gestion",
        finance: "Finance",
        maintenance: "Maintenance"
      }
    },
    systemStatus: {
      title: "État du système",
      subtitle: "Tous les services sont opérationnels",
      operational: "Opérationnel",
      services: {
        api: "API PropManagement",
        email: "Service Email",
        database: "Base de données"
      },
      lastCheck: "Il y a"
    },
    contactInfo: {
      title: "Besoin d'aide supplémentaire ?",
      subtitle: "Notre équipe est disponible du lundi au vendredi, de 9h à 17h"
    },
    badges: {
      available: "Disponible"
    },
    timeUnits: {
      minutes: "minutes",
      ago: "Il y a"
    }
  },
  en: {
    title: "Support Center",
    subtitle: "How can we help you today?",
    backToDashboard: "Back to Dashboard",
    searchPlaceholder: "Search help...",
    supportOptions: {
      chat: {
        title: "Live Chat",
        description: "Get immediate help from our team"
      },
      email: {
        title: "Email Support",
        description: "Send us a detailed message"
      },
      phone: {
        title: "Phone Support",
        description: "Call us directly"
      },
      docs: {
        title: "Documentation",
        description: "Browse our guides and tutorials"
      }
    },
    quickHelp: {
      title: "Quick Help",
      subtitle: "Most viewed articles",
      articles: {
        createProperty: "How to create a property",
        addTenants: "Add tenants",
        managePayments: "Manage payments",
        scheduleMaintenance: "Schedule maintenance"
      },
      categories: {
        getting_started: "Getting Started",
        management: "Management",
        finance: "Finance",
        maintenance: "Maintenance"
      }
    },
    systemStatus: {
      title: "System Status",
      subtitle: "All services are operational",
      operational: "Operational",
      services: {
        api: "PropManagement API",
        email: "Email Service",
        database: "Database"
      },
      lastCheck: ""
    },
    contactInfo: {
      title: "Need additional help?",
      subtitle: "Our team is available Monday to Friday, 9am to 5pm"
    },
    badges: {
      available: "Available"
    },
    timeUnits: {
      minutes: "minutes",
      ago: "ago"
    }
  }
};