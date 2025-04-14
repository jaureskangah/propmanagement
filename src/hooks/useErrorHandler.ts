
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/components/providers/LocaleProvider";
import { AlertCircle, XCircle, Info } from "lucide-react";
import React from "react";

type ErrorSeverity = "error" | "warning" | "info";

export interface ErrorOptions {
  title?: string;
  description?: string;
  severity?: ErrorSeverity;
  showToast?: boolean;
  retry?: () => void;
}

export function useErrorHandler() {
  const { toast } = useToast();
  const { t } = useLocale();

  const handleError = (error: Error | unknown, options?: ErrorOptions) => {
    console.error("Error occurred:", error);
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    const severity = options?.severity || "error";
    
    // Default titles based on severity
    const defaultTitles = {
      error: t('error'),
      warning: t('warning'),
      info: t('info')
    };
    
    // Default icons based on severity
    const icons = {
      error: (props?: React.ComponentProps<typeof XCircle>) => <XCircle {...props} />,
      warning: (props?: React.ComponentProps<typeof AlertCircle>) => <AlertCircle {...props} />,
      info: (props?: React.ComponentProps<typeof Info>) => <Info {...props} />
    };
    
    // Show toast notification if requested
    if (options?.showToast !== false) {
      toast({
        title: options?.title || defaultTitles[severity],
        description: options?.description || errorMessage,
        variant: severity === "error" ? "destructive" : "default",
        icon: icons[severity]({ className: "h-4 w-4" })
      });
    }
    
    return {
      message: errorMessage,
      retry: options?.retry
    };
  };

  return { handleError };
}
