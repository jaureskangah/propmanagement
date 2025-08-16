import { useLocale } from '@/components/providers/LocaleProvider';

export const usePropertyTranslations = () => {
  const { t } = useLocale();
  
  return {
    // Méthode principale pour les traductions de propriété
    t: (key: string) => {
      // Si la clé commence déjà par "property.", l'utiliser directement
      if (key.startsWith('property.')) {
        return t(key);
      }
      
      // Sinon, essayer d'abord avec le préfixe property.
      const propertyKey = `property.${key}`;
      const translation = t(propertyKey, { fallback: '' });
      
      // Si la traduction avec le préfixe property. n'existe pas, essayer la clé directe
      if (!translation || translation === propertyKey) {
        return t(key);
      }
      
      return translation;
    }
  };
};