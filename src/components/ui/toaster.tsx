
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  const getIcon = (variant?: "default" | "destructive" | string) => {
    // Identifier les variants spéciaux par leurs classes
    const isWarning = typeof variant === 'string' && variant.includes("bg-yellow");
    const isInfo = typeof variant === 'string' && variant.includes("bg-blue");
    
    if (variant === "destructive") {
      return <AlertCircle className="h-5 w-5 text-red-400" />;
    } else if (isWarning) {
      return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
    } else if (isInfo) {
      return <Info className="h-5 w-5 text-blue-400" />;
    } else {
      return <CheckCircle className="h-5 w-5 text-green-400" />;
    }
  };

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, className, ...props }) {
        return (
          <Toast key={id} {...props} className={className}>
            <div className="flex items-start gap-3">
              {getIcon(props.variant || className)}
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose>
              <X className="h-4 w-4" />
            </ToastClose>
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
