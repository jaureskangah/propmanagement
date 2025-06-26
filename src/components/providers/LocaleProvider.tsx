
import React, { createContext, useContext, useState, useEffect } from 'react';
import enTranslations from '@/translations/en';
import frTranslations from '@/translations/fr';

type Language = 'en' | 'fr';

interface LocaleContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, options?: { fallback?: string }) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const translations = {
  en: enTranslations,
  fr: frTranslations,
};

export const LocaleProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('preferred-language');
    return (saved === 'en' || saved === 'fr') ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('preferred-language', language);
    console.log('🌐 Language changed to:', language);
    console.log('🔍 Available translations keys:', Object.keys(translations[language]).slice(0, 10));
  }, [language]);

  const t = (key: string, options?: { fallback?: string }) => {
    const translation = translations[language][key];
    
    if (!translation) {
      console.warn(`🚨 Missing translation for key: "${key}" in language: ${language}`);
      console.log('📋 Available keys starting with same prefix:', 
        Object.keys(translations[language])
          .filter(k => k.startsWith(key.split(/[A-Z]/)[0]))
          .slice(0, 5)
      );
      return options?.fallback || key;
    }
    
    return translation;
  };

  const handleLanguageChange = (lang: Language) => {
    console.log('🔄 Changing language from', language, 'to', lang);
    setLanguage(lang);
  };

  return (
    <LocaleContext.Provider value={{ language, setLanguage: handleLanguageChange, t }}>
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
