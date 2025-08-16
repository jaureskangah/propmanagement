import { useLocale } from '@/components/providers/LocaleProvider';

export const usePropertyTranslations = () => {
  const { t } = useLocale();
  
  return {
    t: (key: string) => {
      // Always use property.key format for property translations
      if (key.startsWith('property.')) {
        return t(key);
      }
      return t(`property.${key}`);
    }
  };
};