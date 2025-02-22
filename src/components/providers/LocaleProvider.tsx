
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
  },
  fr: {
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
