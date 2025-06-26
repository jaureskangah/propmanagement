
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'fr';
type UnitSystem = 'metric' | 'imperial';

interface LocaleContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  locale: string;
  unitSystem: UnitSystem;
  setUnitSystem: (system: UnitSystem) => void;
  t: (key: string, params?: Record<string, string> | { fallback?: string }) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

// Traductions complètes intégrées directement dans le composant
const translations = {
  en: {
    // Critical landing page keys
    heroTitle: "Property Management Made Simple",
    heroSubtitle: "The complete solution for Canadian property owners. Manage tenants, maintenance, and finances all in one place.",
    heroGetStarted: "Get Started Free",
    learnMore: "Learn More",
    
    // Navigation essentials
    features: "Features",
    pricing: "Pricing",
    dashboard: "Dashboard",
    login: "Sign In",
    signOut: "Sign Out",
    
    // Footer essentials
    companyName: "PropManagement",
    companyDescription: "Simplifying property management for landlords and property managers",
    product: "Product",
    company: "Company",
    legal: "Legal",
    security: "Security",
    aboutUs: "About Us",
    careers: "Careers",
    contact: "Contact",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    cookiePolicy: "Cookie Policy",
    allRightsReserved: "All rights reserved",
    
    // Features section essentials
    everythingYouNeed: "Everything You Need",
    featuresSubtitle: "Comprehensive tools designed for Canadian property management",
    propertyManagement: "Property Management",
    propertyManagementDesc: "Manage all your properties from one central dashboard",
    tenantManagement: "Tenant Management",
    tenantManagementDesc: "Keep track of tenants, leases, and communications",
    maintenance: "Maintenance",
    maintenanceDesc: "Schedule and track maintenance requests efficiently",
    securityDesc: "Your data is protected with enterprise-grade security",
    
    // CTA section essentials
    readyToStart: "Ready to Simplify Your Management?",
    joinOthers: "Join thousands of property owners who trust our solution",
    ctaStartFree: "Try For Free",
    
    // Common translations
    error: 'Error',
    success: 'Success',
    loading: "Loading",
    cancel: 'Cancel',
    save: "Save",
    edit: "Edit",
    delete: "Delete",
    close: "Close",
    confirm: "Confirm",
  },
  fr: {
    // Critical landing page keys
    heroTitle: "Gestion Immobilière Simplifiée",
    heroSubtitle: "La solution complète pour les propriétaires canadiens. Gérez locataires, maintenance et finances en un seul endroit.",
    heroGetStarted: "Commencer Gratuitement",
    learnMore: "En savoir plus",
    
    // Navigation essentials
    features: "Fonctionnalités",
    pricing: "Tarification",
    dashboard: "Tableau de bord",
    login: "Se connecter",
    signOut: "Se déconnecter",
    
    // Footer essentials
    companyName: "PropManagement",
    companyDescription: "Simplifier la gestion immobilière pour les propriétaires et les gestionnaires",
    product: "Produit",
    company: "Entreprise",
    legal: "Légal",
    security: "Sécurité",
    aboutUs: "À propos",
    careers: "Carrières",
    contact: "Contact",
    privacyPolicy: "Politique de confidentialité",
    termsOfService: "Conditions d'utilisation",
    cookiePolicy: "Politique des cookies",
    allRightsReserved: "Tous droits réservés",
    
    // Features section essentials
    everythingYouNeed: "Tout ce dont vous avez besoin",
    featuresSubtitle: "Des outils complets conçus pour la gestion immobilière canadienne",
    propertyManagement: "Gestion de propriétés",
    propertyManagementDesc: "Gérez toutes vos propriétés depuis un tableau de bord central",
    tenantManagement: "Gestion des locataires",
    tenantManagementDesc: "Suivez les locataires, les baux et les communications",
    maintenance: "Maintenance",
    maintenanceDesc: "Planifier et suivre les demandes de maintenance efficacement",
    securityDesc: "Vos données sont protégées avec une sécurité de niveau entreprise",
    
    // CTA section essentials
    readyToStart: "Prêt à simplifier votre gestion ?",
    joinOthers: "Rejoignez des milliers de propriétaires qui nous font confiance",
    ctaStartFree: "Essayer gratuitement",
    
    // Common translations
    error: 'Erreur',
    success: 'Succès',
    loading: "Chargement",
    cancel: 'Annuler',
    save: "Enregistrer",
    edit: "Modifier",
    delete: "Supprimer",
    close: "Fermer",
    confirm: "Confirmer",
  }
};

export const LocaleProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('preferred-language');
      return (saved === 'en' || saved === 'fr') ? saved : 'en';
    } catch {
      return 'en';
    }
  });

  const [unitSystem, setUnitSystem] = useState<UnitSystem>(() => {
    try {
      const saved = localStorage.getItem('preferred-unit-system');
      return (saved === 'metric' || saved === 'imperial') ? saved : 'metric';
    } catch {
      return 'metric';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('preferred-language', language);
      console.log('🌐 Language changed to:', language);
    } catch (error) {
      console.warn('Failed to save language preference:', error);
    }
  }, [language]);

  useEffect(() => {
    try {
      localStorage.setItem('preferred-unit-system', unitSystem);
    } catch (error) {
      console.warn('Failed to save unit system preference:', error);
    }
  }, [unitSystem]);

  const t = (key: string, params?: Record<string, string> | { fallback?: string }) => {
    let translation = translations[language][key];
    
    if (!translation) {
      console.warn(`🚨 Missing translation for key: "${key}" in language: ${language}`);
      
      // Check if params has fallback property
      if (params && 'fallback' in params) {
        return params.fallback || key;
      }
      
      return key;
    }
    
    // Replace parameters in translation
    if (params && typeof params === 'object' && !('fallback' in params)) {
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{${param}}`, params[param]);
      });
    }
    
    return translation;
  };

  const handleLanguageChange = (lang: Language) => {
    console.log('🔄 Changing language from', language, 'to', lang);
    setLanguage(lang);
  };

  const handleUnitSystemChange = (system: UnitSystem) => {
    console.log('🔄 Changing unit system from', unitSystem, 'to', system);
    setUnitSystem(system);
  };

  // Provide locale string for date formatting
  const locale = language === 'fr' ? 'fr-FR' : 'en-US';

  return (
    <LocaleContext.Provider value={{ 
      language, 
      setLanguage: handleLanguageChange, 
      locale,
      unitSystem,
      setUnitSystem: handleUnitSystemChange,
      t 
    }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};
