
import { useLocale } from '@/components/providers/LocaleProvider';
import { useCallback } from 'react';

export const useSafeTranslation = () => {
  const { t } = useLocale();

  const getSafeTranslation = useCallback((key: string, fallback: string): string => {
    try {
      if (typeof t !== 'function') {
        console.warn(`Translation function not available, using fallback for: ${key}`);
        return fallback;
      }
      
      const translation = t(key);
      
      // Check if translation is valid
      if (typeof translation !== 'string') {
        console.warn(`Invalid translation for key "${key}", using fallback`);
        return fallback;
      }
      
      return translation;
    } catch (error) {
      console.warn(`Translation error for key "${key}":`, error);
      return fallback;
    }
  }, [t]);

  return { t: getSafeTranslation };
};
