
import React, { createContext, useContext, useState, useEffect } from 'react';
import enTranslations from '@/translations/en';
import frTranslations from '@/translations/fr';

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

const translations = {
  en: enTranslations,
  fr: frTranslations,
};

// Fallback translations for critical landing page keys
const fallbackTranslations = {
  en: {
    heroTitle: "Property Management Made Simple",
    heroSubtitle: "The complete solution for Canadian property owners",
    heroGetStarted: "Get Started Free",
    learnMore: "Learn More",
    features: "Features",
    pricing: "Pricing",
    dashboard: "Dashboard",
    login: "Sign In",
    signOut: "Sign Out",
    companyName: "PropManagement",
    companyDescription: "Simplifying property management",
    everythingYouNeed: "Everything You Need",
    featuresSubtitle: "Comprehensive property management tools",
    readyToStart: "Ready to Get Started?",
    ctaStartFree: "Try For Free"
  },
  fr: {
    heroTitle: "Gestion Immobilière Simplifiée",
    heroSubtitle: "La solution complète pour les propriétaires canadiens",
    heroGetStarted: "Commencer Gratuitement",
    learnMore: "En savoir plus",
    features: "Fonctionnalités",
    pricing: "Tarification",
    dashboard: "Tableau de bord",
    login: "Se connecter",
    signOut: "Se déconnecter",
    companyName: "PropManagement",
    companyDescription: "Simplifier la gestion immobilière",
    everythingYouNeed: "Tout ce dont vous avez besoin",
    featuresSubtitle: "Outils complets de gestion immobilière",
    readyToStart: "Prêt à commencer ?",
    ctaStartFree: "Essayer gratuitement"
  }
};

export const LocaleProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('preferred-language');
    return (saved === 'en' || saved === 'fr') ? saved : 'en';
  });

  const [unitSystem, setUnitSystem] = useState<UnitSystem>(() => {
    const saved = localStorage.getItem('preferred-unit-system');
    return (saved === 'metric' || saved === 'imperial') ? saved : 'metric';
  });

  useEffect(() => {
    localStorage.setItem('preferred-language', language);
    console.log('🌐 Language changed to:', language);
    console.log('🔍 Available translations keys:', Object.keys(translations[language]).slice(0, 10));
  }, [language]);

  useEffect(() => {
    localStorage.setItem('preferred-unit-system', unitSystem);
  }, [unitSystem]);

  const t = (key: string, params?: Record<string, string> | { fallback?: string }) => {
    // First try to get translation from main translations
    let translation = translations[language][key];
    
    // If not found, try fallback translations for critical keys
    if (!translation && fallbackTranslations[language][key]) {
      translation = fallbackTranslations[language][key];
      console.log(`🔄 Using fallback translation for key: "${key}"`);
    }
    
    if (!translation) {
      console.warn(`🚨 Missing translation for key: "${key}" in language: ${language}`);
      console.log('📋 Available keys starting with same prefix:', 
        Object.keys(translations[language])
          .filter(k => k.startsWith(key.split(/[A-Z]/)[0]))
          .slice(0, 5)
      );
      
      // Check if params has fallback property
      if (params && 'fallback' in params) {
        return params.fallback || key;
      }
      
      // Use fallback from fallbackTranslations if available
      if (fallbackTranslations[language][key]) {
        return fallbackTranslations[language][key];
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
