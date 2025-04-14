
import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocale } from "@/components/providers/LocaleProvider";

export interface ErrorStateProps {
  title?: string;
  error?: Error | string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState = ({
  title,
  error,
  description,
  onRetry,
  className,
}: ErrorStateProps) => {
  const { t } = useLocale();
  
  const errorMessage = error instanceof Error ? error.message : error;
  
  return (
    <div className={`space-y-4 ${className || ""}`}>
      <Card className="p-6 text-center bg-background/50 backdrop-blur-sm">
        <div className="flex flex-col items-center">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-medium mb-2">{title || t('errorLoadingData')}</h3>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">
            {description || errorMessage || t('unexpectedError')}
          </p>
          {onRetry && (
            <Button onClick={onRetry} variant="outline">
              {t('tryAgain')}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
