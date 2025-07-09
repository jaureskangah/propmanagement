
import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  onRetry: () => void;
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50 rounded-md border border-gray-200">
      <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
      <h3 className="text-lg font-medium mb-2">Impossible d'afficher le PDF</h3>
      <p className="text-sm text-gray-500 text-center mb-4 max-w-md">
        Le document ne peut pas être affiché. Vous pouvez réessayer.
      </p>
      <Button 
        onClick={onRetry}
        variant="outline"
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Réessayer
      </Button>
    </div>
  );
}
