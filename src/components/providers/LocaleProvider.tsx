import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'fr';
type UnitSystem = 'metric' | 'imperial';

interface LocaleContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  unitSystem: UnitSystem;
  setUnitSystem: (system: UnitSystem) => void;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    features: "Features",
    pricing: "Pricing",
    freeTrial: "Free Trial",
    signIn: "Sign In",
    signOut: "Sign Out",
    dashboard: "Dashboard",
    language: "Language",
    units: "Units",
    metric: "Metric",
    imperial: "Imperial",

    // Hero Section
    heroTitle: "Simplify Your Property Management",
    heroSubtitle: "A complete solution to manage your properties, tenants, and maintenance with ease.",
    getStarted: "Get Started Now",
    learnMore: "Learn More",

    // Features Section
    everythingYouNeed: "Everything You Need",
    featuresSubtitle: "Powerful tools for efficient management of your real estate portfolio",
    propertyManagement: "Property Management",
    propertyManagementDesc: "Track your properties and their performance in real-time",
    tenantManagement: "Tenant Management",
    tenantManagementDesc: "Easily manage your tenants and their documents",
    maintenance: "Maintenance",
    maintenanceDesc: "Track and manage maintenance requests",
    security: "Security",
    securityDesc: "Your data is secure and protected",

    // Pricing Plans
    freemiumPlan: "Freemium",
    proPlan: "Pro",
    enterprisePlan: "Enterprise",
    free: "Free",
    month: "/month",
    mostPopular: "Most Popular",
    pricingTitle: "Simple and transparent pricing",
    pricingSubtitle: "Choose the plan that best fits your needs",
    pricingStartFree: "Start for free",
    getStarted: "Get Started",

    // Plan Features
    upTo2Properties: "Up to 2 properties",
    upTo5Properties: "Up to 5 properties",
    upTo20Properties: "Up to 20 properties",
    rentManagement: "Rent management",
    digitalDocuments: "Digital documents",
    basicPropertyCards: "Basic property cards",
    emailNotifications: "Email notifications",
    tenantVerification: "Tenant verification",
    prioritySupport: "Priority support",
    advancedDashboard: "Advanced dashboard",
    financialReports: "Financial reports",
    maintenanceManagement: "Maintenance management",
    dedicatedSupport: "24/7 dedicated support",
    customDashboard: "Custom dashboard",
    advancedFinancialReports: "Advanced financial reports",
    userTraining: "User training",
    dailyBackup: "Daily backup",

    // Toast Messages
    authRequired: "Authentication required",
    pleaseSignInToSubscribe: "Please sign in to subscribe to a plan",
    processing: "Processing",
    preparingPaymentSession: "Preparing your payment session...",
    error: "Error",
    failedToCreateSession: "Failed to create payment session",
    failedToCreateSessionNoUrl: "Failed to create payment session - no URL received",
    generalError: "An error occurred while processing your request",

    // Contact Section
    contactUs: "Contact Us",
    contactSubtitle: "We're here to help and answer any question you might have",
    phone: "Phone",
    email: "Email",
    office: "Office",
    sendMessage: "Send us a message",
    yourName: "Your name",
    yourEmail: "your@email.com",
    message: "How can we help you?",
    sending: "Sending...",
    send: "Send message",

    // Authentication
    welcome: "Welcome to PropManagement",
    authDescription: "Please sign in or create an account to continue",
    firstName: "First Name",
    lastName: "Last Name",
    password: "Password",
    confirmPassword: "Confirm Password",
    iAmTenant: "I am a tenant",
    register: "Sign Up",
    processingRegistration: "Registration in progress...",
    processingLogin: "Login in progress...",

    // Call to Action
    readyToStart: "Ready to Simplify Your Management?",
    joinOthers: "Join thousands of property owners who trust our solution",
    ctaStartFree: "Try For Free",

    // FAQ
    frequentlyAskedQuestions: "Frequently Asked Questions",
    findAnswers: "Find quick answers to your questions",
    faqHowToStart: "How can I start using the platform?",
    faqHowToStartAnswer: "It's very simple! Create a free account, add your properties, and start managing your real estate in minutes. Our intuitive interface will guide you through each step.",
    faqFeatures: "What features are included in the basic subscription?",
    faqFeaturesAnswer: "The basic subscription includes property management, payment tracking, document management, and tenant communication. You have access to all essential features for efficient management.",
    faqMultipleProperties: "Can I manage multiple properties?",
    faqMultiplePropertiesAnswer: "Yes, you can manage as many properties as you want. Our platform is designed to adapt to your real estate portfolio, whether you have one or multiple properties.",
    faqCommunication: "How does tenant communication work?",
    faqCommunicationAnswer: "Our integrated messaging system enables direct and efficient communication with your tenants. You can send notifications, respond to requests, and share documents, all from a centralized interface.",
    faqSecurity: "Is my data secure?",
    faqSecurityAnswer: "Security is our priority. All data is encrypted and securely stored. We use the latest security technologies to protect your information and that of your tenants.",
    faqExport: "Can I export my data?",
    faqExportAnswer: "Yes, you can export your data at any time in different formats (PDF, Excel). This allows you to keep track of your activity and generate customized reports."
  },
  fr: {
    // Navigation
    features: "Fonctionnalités",
    pricing: "Tarification",
    freeTrial: "Essai gratuit",
    signIn: "Connexion",
    signOut: "Déconnexion",
    dashboard: "Tableau de bord",
    language: "Langue",
    units: "Unités",
    metric: "Métrique",
    imperial: "Impérial",

    // Hero Section
    heroTitle: "Simplifiez votre gestion immobilière",
    heroSubtitle: "Une solution complète pour gérer vos propriétés, locataires et maintenance en toute simplicité.",
    getStarted: "Commencer maintenant",
    learnMore: "En savoir plus",

    // Features Section
    everythingYouNeed: "Tout ce dont vous avez besoin",
    featuresSubtitle: "Des outils puissants pour une gestion efficace de votre portefeuille immobilier",
    propertyManagement: "Gestion immobilière",
    propertyManagementDesc: "Suivez vos propriétés et leurs performances en temps réel",
    tenantManagement: "Gestion des locataires",
    tenantManagementDesc: "Gérez facilement vos locataires et leurs documents",
    maintenance: "Maintenance",
    maintenanceDesc: "Suivez et gérez les demandes de maintenance",
    security: "Sécurité",
    securityDesc: "Vos données sont sécurisées et protégées",

    // Pricing Plans
    freemiumPlan: "Gratuit",
    proPlan: "Pro",
    enterprisePlan: "Entreprise",
    free: "Gratuit",
    month: "/mois",
    mostPopular: "Le plus populaire",
    pricingTitle: "Tarification simple et transparente",
    pricingSubtitle: "Choisissez le forfait qui correspond le mieux à vos besoins",
    pricingStartFree: "Commencer gratuitement",
    getStarted: "Commencer",

    // Plan Features
    upTo2Properties: "Jusqu'à 2 propriétés",
    upTo5Properties: "Jusqu'à 5 propriétés",
    upTo20Properties: "Jusqu'à 20 propriétés",
    rentManagement: "Gestion des loyers",
    digitalDocuments: "Documents numériques",
    basicPropertyCards: "Fiches propriétés basiques",
    emailNotifications: "Notifications par email",
    tenantVerification: "Vérification des locataires",
    prioritySupport: "Support prioritaire",
    advancedDashboard: "Tableau de bord avancé",
    financialReports: "Rapports financiers",
    maintenanceManagement: "Gestion de la maintenance",
    dedicatedSupport: "Support dédié 24/7",
    customDashboard: "Tableau de bord personnalisé",
    advancedFinancialReports: "Rapports financiers avancés",
    userTraining: "Formation utilisateur",
    dailyBackup: "Sauvegarde quotidienne",

    // Toast Messages
    authRequired: "Authentification requise",
    pleaseSignInToSubscribe: "Veuillez vous connecter pour souscrire à un forfait",
    processing: "Traitement en cours",
    preparingPaymentSession: "Préparation de votre session de paiement...",
    error: "Erreur",
    failedToCreateSession: "Échec de la création de la session de paiement",
    failedToCreateSessionNoUrl: "Échec de la création de la session de paiement - aucune URL reçue",
    generalError: "Une erreur est survenue lors du traitement de votre demande",

    // Contact Section
    contactUs: "Contactez-nous",
    contactSubtitle: "Nous sommes là pour vous aider et répondre à toutes vos questions",
    phone: "Téléphone",
    email: "Email",
    office: "Bureau",
    sendMessage: "Envoyez-nous un message",
    yourName: "Votre nom",
    yourEmail: "votre@email.com",
    message: "Comment pouvons-nous vous aider ?",
    sending: "Envoi en cours...",
    send: "Envoyer le message",

    // Authentication
    welcome: "Bienvenue sur PropManagement",
    authDescription: "Veuillez vous connecter ou créer un compte pour continuer",
    firstName: "Prénom",
    lastName: "Nom",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    iAmTenant: "Je suis locataire",
    register: "S'inscrire",
    processingRegistration: "Inscription en cours...",
    processingLogin: "Connexion en cours...",

    // Call to Action
    readyToStart: "Prêt à simplifier votre gestion ?",
    joinOthers: "Rejoignez des milliers de propriétaires qui nous font confiance",
    ctaStartFree: "Essayer gratuitement",

    // FAQ
    frequentlyAskedQuestions: "Questions fréquentes",
    findAnswers: "Trouvez rapidement des réponses à vos questions",
    faqHowToStart: "Comment puis-je commencer à utiliser la plateforme ?",
    faqHowToStartAnswer: "C'est très simple ! Créez un compte gratuit, ajoutez vos propriétés et commencez à gérer votre immobilier en quelques minutes. Notre interface intuitive vous guidera à chaque étape.",
    faqFeatures: "Quelles fonctionnalités sont incluses dans l'abonnement de base ?",
    faqFeaturesAnswer: "L'abonnement de base comprend la gestion des propriétés, le suivi des paiements, la gestion des documents et la communication avec les locataires. Vous avez accès à toutes les fonctionnalités essentielles pour une gestion efficace.",
    faqMultipleProperties: "Puis-je gérer plusieurs propriétés ?",
    faqMultiplePropertiesAnswer: "Oui, vous pouvez gérer autant de propriétés que vous le souhaitez. Notre plateforme est conçue pour s'adapter à votre portefeuille immobilier, que vous ayez une ou plusieurs propriétés.",
    faqCommunication: "Comment fonctionne la communication avec les locataires ?",
    faqCommunicationAnswer: "Notre système de messagerie intégré permet une communication directe et efficace avec vos locataires. Vous pouvez envoyer des notifications, répondre aux demandes et partager des documents, le tout depuis une interface centralisée.",
    faqSecurity: "Mes données sont-elles sécurisées ?",
    faqSecurityAnswer: "La sécurité est notre priorité. Toutes les données sont cryptées et stockées de manière sécurisée. Nous utilisons les dernières technologies de sécurité pour protéger vos informations et celles de vos locataires.",
    faqExport: "Puis-je exporter mes données ?",
    faqExportAnswer: "Oui, vous pouvez exporter vos données à tout moment dans différents formats (PDF, Excel). Cela vous permet de garder une trace de votre activité et de générer des rapports personnalisés."
  }
};

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LocaleContext.Provider value={{
      language,
      setLanguage,
      unitSystem,
      setUnitSystem,
      t
    }}>
      {children}
    </LocaleContext.Provider>
  );
}

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};
