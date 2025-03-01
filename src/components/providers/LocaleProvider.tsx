
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Language, UnitSystem, Translations } from '@/translations/types';
import { enTranslations } from '@/translations/en';
import { frTranslations } from '@/translations/fr';
import { toast } from "@/hooks/use-toast";

interface LocaleContextType {
  language: Language;
  locale: string;
  setLanguage: (lang: Language) => void;
  unitSystem: UnitSystem;
  setUnitSystem: (system: UnitSystem) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const translations: Record<Language, Translations> = {
  en: enTranslations as unknown as Translations,
  fr: frTranslations as unknown as Translations
};

const LANGUAGE_STORAGE_KEY = 'app-language';
const UNIT_SYSTEM_STORAGE_KEY = 'app-unit-system';

const getInitialLanguage = (): Language => {
  try {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage === 'fr' || savedLanguage === 'en') {
      return savedLanguage;
    }
    const browserLang = navigator.language.split('-')[0];
    const defaultLang: Language = browserLang === 'fr' ? 'fr' : 'en';
    localStorage.setItem(LANGUAGE_STORAGE_KEY, defaultLang);
    return defaultLang;
  } catch (error) {
    console.error('Error getting initial language:', error);
    return 'en';
  }
};

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);
  const [updateKey, setUpdateKey] = useState(0);
  const [unitSystem, setUnitSystemState] = useState<UnitSystem>(() => {
    try {
      const savedUnitSystem = localStorage.getItem(UNIT_SYSTEM_STORAGE_KEY);
      return (savedUnitSystem === 'metric' || savedUnitSystem === 'imperial') ? savedUnitSystem : 'metric';
    } catch {
      return 'metric';
    }
  });

  const setLanguage = (newLanguage: Language) => {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
      setLanguageState(newLanguage);
      setUpdateKey(prevKey => prevKey + 1);
      
      toast({
        title: "Langue modifiée",
        description: newLanguage === 'fr' ? "La langue a été changée en français" : "Language has been changed to English",
      });
    } catch (error) {
      console.error('Error setting language:', error);
      toast({
        title: "Erreur",
        description: "Impossible de changer la langue",
        variant: "destructive",
      });
    }
  };

  const setUnitSystem = (newUnitSystem: UnitSystem) => {
    try {
      localStorage.setItem(UNIT_SYSTEM_STORAGE_KEY, newUnitSystem);
      setUnitSystemState(newUnitSystem);
    } catch (error) {
      console.error('Error setting unit system:', error);
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string, params?: Record<string, string>): string => {
    const currentTranslations = translations[language];
    const keys = key.split('.');
    let translation: any = currentTranslations;
    
    for (const k of keys) {
      if (translation && typeof translation === 'object' && k in translation) {
        translation = translation[k];
      } else {
        console.warn(`Missing translation for key: ${key} in language: ${language}`);
        return key;
      }
    }
    
    if (typeof translation !== 'string') {
      console.warn(`Unexpected object for translation key: ${key}`);
      return key;
    }
    
    // Replace parameters in the translation string if provided
    if (params) {
      let resultStr = translation as string;
      for (const [paramKey, paramValue] of Object.entries(params)) {
        resultStr = resultStr.replace(new RegExp(`{${paramKey}}`, 'g'), paramValue);
      }
      return resultStr;
    }
    
    return translation;
  };

  // La propriété locale dérivée de language pour usage avec les bibliothèques comme date-fns
  const locale = language;

  const value = {
    language,
    locale,
    setLanguage,
    unitSystem,
    setUnitSystem,
    t
  };

  return (
    <LocaleContext.Provider value={value}>
      {React.Children.map(children, child =>
        React.isValidElement(child)
          ? React.cloneElement(child, { key: updateKey })
          : child
      )}
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
