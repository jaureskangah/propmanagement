import { useLocale } from "@/components/providers/LocaleProvider";
import { enSupport } from "@/translations/features/support/en";
import { frSupport } from "@/translations/features/support/fr";

export const useSupportTranslations = () => {
  const { language } = useLocale();
  
  const translations = language === 'en' ? enSupport : frSupport;
  
  const t = (key: keyof typeof translations) => {
    return translations[key] || key;
  };

  return { t, translations };
};