
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

interface ErrorStateProps {
  type?: string;
  error?: Error;
  onRetry?: () => void;
}

export const ErrorState = ({ type = "metrics", error, onRetry }: ErrorStateProps) => {
  const { t } = useLocale();
  
  return (
    <div className="space-y-4">
      <Card className="p-6 text-center bg-background/50 backdrop-blur-sm">
        <div className="flex flex-col items-center">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-medium mb-2">{t('errorLoadingData')}</h3>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">
            {error?.message || t('unexpectedError')}
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
