
import { useLocale } from "@/components/providers/LocaleProvider";
import { enForm } from "@/translations/features/tenant/en/form";
import { frForm } from "@/translations/features/tenant/fr/form";

export const useTenantFormTranslations = () => {
  const { locale } = useLocale();
  
  const translations = locale === 'en' ? enForm : frForm;
  
  const t = (key: keyof typeof translations) => {
    return translations[key] || key;
  };
  
  return { t, translations };
};
