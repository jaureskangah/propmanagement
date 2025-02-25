
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

// Fonction d'initialisation de la langue
const initializeLanguage = (): Language => {
  const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (savedLanguage === 'fr' || savedLanguage === 'en') {
    return savedLanguage;
  }
  // Si pas de langue sauvegardée, utiliser la langue du navigateur
  const browserLang = navigator.language.split('-')[0];
  const defaultLang: Language = browserLang === 'fr' ? 'fr' : 'en';
  localStorage.setItem(LANGUAGE_STORAGE_KEY, defaultLang);
  return defaultLang;
};

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(initializeLanguage);
  const [unitSystem, setUnitSystemState] = useState<UnitSystem>(() => {
    const savedUnitSystem = localStorage.getItem(UNIT_SYSTEM_STORAGE_KEY);
    return (savedUnitSystem === 'metric' || savedUnitSystem === 'imperial') ? savedUnitSystem : 'metric';
  });

  useEffect(() => {
    // Réinitialiser la langue si elle n'est pas dans localStorage
    const currentLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (!currentLanguage) {
      const newLang = initializeLanguage();
      setLanguageState(newLang);
    }
  }, []);

  // Persist language changes to localStorage
  const setLanguage = (newLanguage: Language) => {
    console.log('Setting language to:', newLanguage); // Debug log
    localStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
    setLanguageState(newLanguage);
  };

  // Persist unit system changes to localStorage
  const setUnitSystem = (newUnitSystem: UnitSystem) => {
    localStorage.setItem(UNIT_SYSTEM_STORAGE_KEY, newUnitSystem);
    setUnitSystemState(newUnitSystem);
  };

  // Translation function
  const t = (key: string): string => {
    return translations[language][key as keyof Translations] || key;
  };

  // Debug log pour suivre les changements de langue
  useEffect(() => {
    console.log('Current language:', language);
    console.log('Stored language:', localStorage.getItem(LANGUAGE_STORAGE_KEY));
  }, [language]);

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
