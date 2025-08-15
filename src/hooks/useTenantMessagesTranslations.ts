import { useLocale } from "@/components/providers/LocaleProvider";
import { enMessages } from "@/translations/features/tenant/en/messages";
import { frMessages } from "@/translations/features/tenant/fr/messages";

export const useTenantMessagesTranslations = () => {
  const { language } = useLocale();
  
  const translations = language === 'en' ? enMessages : frMessages;
  
  const t = (key: keyof typeof translations) => {
    return translations[key] || key;
  };

  return { t, translations };
};