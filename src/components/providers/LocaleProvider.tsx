
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

    // Pricing Section
    pricingTitle: "Simple and transparent pricing",
    pricingSubtitle: "Choose the plan that best fits your needs",
    startForFree: "Start for free",
    mostPopular: "Most popular",
    month: "/month",
    
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

    // Pricing Section
    pricingTitle: "Tarification simple et transparente",
    pricingSubtitle: "Choisissez le forfait qui correspond le mieux à vos besoins",
    startForFree: "Commencer gratuitement",
    mostPopular: "Le plus populaire",
    month: "/mois",

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
