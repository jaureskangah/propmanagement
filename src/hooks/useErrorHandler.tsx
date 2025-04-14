
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
    
    // Create icon components based on severity
    const getIcon = (severity: ErrorSeverity) => {
      const iconProps = { className: "h-4 w-4" };
      
      switch (severity) {
        case "error":
          return React.createElement(XCircle, iconProps);
        case "warning":
          return React.createElement(AlertCircle, iconProps);
        case "info":
          return React.createElement(Info, iconProps);
        default:
          return React.createElement(AlertCircle, iconProps);
      }
    };
    
    // Show toast notification if requested
    if (options?.showToast !== false) {
      // Remove the icon property from toast as it's not supported
      toast({
        title: options?.title || defaultTitles[severity],
        description: options?.description || errorMessage,
        variant: severity === "error" ? "destructive" : "default"
      });
    }
    
    return {
      message: errorMessage,
      retry: options?.retry
    };
  };

  return { handleError };
}
