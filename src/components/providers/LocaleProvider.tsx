
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, UnitSystem, Translations } from '@/translations/types';
import { enTranslations } from '@/translations/en';
import { frTranslations } from '@/translations/fr';

interface LocaleContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  unitSystem: UnitSystem;
  setUnitSystem: (system: UnitSystem) => void;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const translations: Record<Language, Translations> = {
  en: enTranslations,
  fr: frTranslations
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
  const [unitSystem, setUnitSystemState] = useState<UnitSystem>(() => {
    try {
      const savedUnitSystem = localStorage.getItem(UNIT_SYSTEM_STORAGE_KEY);
      return (savedUnitSystem === 'metric' || savedUnitSystem === 'imperial') ? savedUnitSystem : 'metric';
    } catch {
      return 'metric';
    }
  });

  // Force re-render of all components using translations
  const [translationVersion, setTranslationVersion] = useState(0);

  useEffect(() => {
    document.documentElement.lang = language;
    console.log('Language changed to:', language);
    console.log('Available translations:', Object.keys(translations[language]));
    // Increment version to force re-render
    setTranslationVersion(prev => prev + 1);
  }, [language]);

  const setLanguage = (newLanguage: Language) => {
    try {
      console.log('Setting language to:', newLanguage);
      localStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
      setLanguageState(newLanguage);
    } catch (error) {
      console.error('Error setting language:', error);
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

  const t = (key: string): string => {
    try {
      const currentTranslations = translations[language];
      
      // Include translationVersion in dependency to force re-evaluation
      const translation = currentTranslations[key as keyof Translations];
      if (!translation) {
        console.warn(`Missing translation for key: ${key} in language: ${language}`);
        return key;
      }
      return translation;
    } catch (error) {
      console.error(`Error getting translation for key: ${key}`, error);
      return key;
    }
  };

  const contextValue = React.useMemo(() => ({
    language,
    setLanguage,
    unitSystem,
    setUnitSystem,
    t
  }), [language, unitSystem, translationVersion]); // Include translationVersion in dependencies

  return (
    <LocaleContext.Provider value={contextValue}>
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
