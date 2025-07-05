
import { useLocale } from "@/components/providers/LocaleProvider";
import { enList } from "@/translations/features/tenant/en/list";
import { frList } from "@/translations/features/tenant/fr/list";

export const useTenantListTranslations = () => {
  const { locale } = useLocale();
  
  const translations = locale === 'en' ? enList : frList;
  
  const t = (key: keyof typeof translations) => {
    return translations[key] || key;
  };
  
  return { t, translations };
};
