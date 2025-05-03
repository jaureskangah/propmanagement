
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/components/providers/LocaleProvider";

/**
 * Hook personnalisé pour afficher des notifications via le système de toast
 * avec des traductions et des messages d'erreur détaillés.
 */
export const useNotification = () => {
  const { toast } = useToast();
  const { t } = useLocale();

  const showSuccess = (messageKey: string, params?: Record<string, string>) => {
    toast({
      title: t("success"),
      description: t(messageKey, params),
      variant: "default",
    });
  };

  const showError = (messageKey: string, error?: any, params?: Record<string, string>) => {
    console.error(`Error (${messageKey}):`, error);
    
    // Message principal traduit
    let errorDescription = t(messageKey, params);
    
    // Ajouter des détails sur l'erreur si disponible
    if (error) {
      // Pour les erreurs Supabase
      if (error.code) {
        // Ajouter des conseils spécifiques selon le type d'erreur
        switch (error.code) {
          case "23505": // Violation de contrainte unique
            errorDescription += ` ${t("errors.alreadyExists")}`;
            break;
          case "23503": // Violation de clé étrangère
            errorDescription += ` ${t("errors.relatedRecordNotFound")}`;
            break;
          case "42P01": // Table non trouvée
            errorDescription += ` ${t("errors.contactSupport")}`;
            break;
          case "auth/invalid-email":
            errorDescription += ` ${t("errors.invalidEmail")}`;
            break;
          case "auth/wrong-password":
            errorDescription += ` ${t("errors.wrongPassword")}`;
            break;
          default:
            // Pour les autres codes d'erreur, ajoutez le code pour référence
            if (process.env.NODE_ENV === "development") {
              errorDescription += ` (${error.code})`;
            }
        }
      } else if (error.message) {
        // Pour les erreurs JavaScript standard
        if (process.env.NODE_ENV === "development") {
          errorDescription += `: ${error.message}`;
        }
      }
    }

    toast({
      title: t("error"),
      description: errorDescription,
      variant: "destructive",
    });
  };

  const showWarning = (messageKey: string, params?: Record<string, string>) => {
    toast({
      title: t("warning"),
      description: t(messageKey, params),
      variant: "default",
      className: "bg-yellow-100 dark:bg-yellow-900 border-yellow-400",
    });
  };

  const showInfo = (messageKey: string, params?: Record<string, string>) => {
    toast({
      title: t("info"),
      description: t(messageKey, params),
      variant: "default",
      className: "bg-blue-100 dark:bg-blue-900 border-blue-400",
    });
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};
