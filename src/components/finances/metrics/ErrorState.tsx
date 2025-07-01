
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  error: Error;
  onRetry: () => void;
  type?: "metrics" | "financial-overview" | "chart";
}

export const ErrorState = ({ error, onRetry, type = "metrics" }: ErrorStateProps) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center h-48 text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <div>
          <p className="font-medium text-destructive mb-1">
            Erreur lors du chargement des données
          </p>
          <p className="text-sm text-muted-foreground">
            {error.message}
          </p>
        </div>
        <Button onClick={onRetry} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Réessayer
        </Button>
      </CardContent>
    </Card>
  );
};
