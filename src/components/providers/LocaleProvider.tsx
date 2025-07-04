
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

// Import des traductions depuis les fichiers dédiés
const translations = {
  en: enTranslations,
  fr: frTranslations
};

// Fonction utilitaire pour accéder aux clés imbriquées
const getNestedValue = (obj: any, key: string): any => {
  return key.split('.').reduce((current, keyPart) => {
    return current && current[keyPart] !== undefined ? current[keyPart] : undefined;
  }, obj);
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
    // Support des clés imbriquées avec la notation pointée
    let translation = getNestedValue(translations[language], key);
    
    // Si la clé imbriquée n'existe pas, essayer la clé plate (compatibilité arrière)
    if (!translation) {
      translation = translations[language][key];
    }
    
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
