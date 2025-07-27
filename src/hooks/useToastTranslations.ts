import { useLocale } from "@/components/providers/LocaleProvider";
import { enToasts } from "@/translations/features/toasts";
import { frToasts } from "@/translations/features/toasts";

export const useToastTranslations = () => {
  const { language } = useLocale();
  
  const translations = language === 'en' ? enToasts : frToasts;
  
  const t = (key: keyof typeof translations) => {
    return translations[key] || key;
  };

  return { t, translations };
};