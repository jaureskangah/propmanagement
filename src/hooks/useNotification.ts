
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/components/providers/LocaleProvider";
import { ToastAction } from "@/components/ui/toast";

type NotificationType = "success" | "error" | "warning" | "info";
type ActionCallback = () => void;

interface NotificationOptions {
  /**
   * Action label to display
   */
  actionLabel?: string;
  /**
   * Callback function when action is clicked
   */
  onAction?: ActionCallback;
  /**
   * Duration in milliseconds (default: 5000ms)
   */
  duration?: number;
}

export function useNotification() {
  const { toast } = useToast();
  const { t } = useLocale();

  const showNotification = (
    type: NotificationType,
    message: string,
    options?: NotificationOptions
  ) => {
    let title = "";
    let variant: "default" | "destructive" | null = null;

    // Déterminer le titre et la variante en fonction du type
    switch (type) {
      case "success":
        title = t("success");
        variant = "default";
        break;
      case "error":
        title = t("error");
        variant = "destructive";
        break;
      case "warning":
        title = t("warning");
        variant = "default";
        break;
      case "info":
        title = t("info");
        variant = "default";
        break;
    }

    // Construire l'action si nécessaire
    const action = options?.actionLabel && options?.onAction ? (
      <ToastAction altText={options.actionLabel} onClick={options.onAction}>
        {options.actionLabel}
      </ToastAction>
    ) : undefined;

    // Afficher la notification
    return toast({
      title,
      description: message,
      variant,
      action,
      duration: options?.duration || 5000,
    });
  };

  return {
    success: (message: string, options?: NotificationOptions) => 
      showNotification("success", message, options),
    error: (message: string, options?: NotificationOptions) => 
      showNotification("error", message, options),
    warning: (message: string, options?: NotificationOptions) => 
      showNotification("warning", message, options),
    info: (message: string, options?: NotificationOptions) => 
      showNotification("info", message, options),
  };
}
