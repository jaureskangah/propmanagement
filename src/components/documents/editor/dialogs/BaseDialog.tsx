
import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/LocaleProvider";

interface BaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  showCancelButton?: boolean;
  cancelText?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function BaseDialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  showCancelButton = true,
  cancelText,
  size = "md",
  className,
}: BaseDialogProps) {
  const { t } = useLocale();
  
  const sizeClasses = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg"
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`${sizeClasses[size]} ${className || ""}`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        
        <div className="py-4">{children}</div>
        
        <DialogFooter>
          {showCancelButton && (
            <Button variant="outline" onClick={onClose}>
              {cancelText || t('cancel') || "Annuler"}
            </Button>
          )}
          {footer}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
