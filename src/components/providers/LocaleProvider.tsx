
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

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  // Initialize from localStorage or default to 'en'
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return (savedLanguage === 'fr' || savedLanguage === 'en') ? savedLanguage : 'en';
  });

  const [unitSystem, setUnitSystemState] = useState<UnitSystem>(() => {
    const savedUnitSystem = localStorage.getItem(UNIT_SYSTEM_STORAGE_KEY);
    return (savedUnitSystem === 'metric' || savedUnitSystem === 'imperial') ? savedUnitSystem : 'metric';
  });

  // Persist language changes to localStorage
  const setLanguage = (newLanguage: Language) => {
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
