
import { AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  error: Error;
  onRetry?: () => void;
}

export const ErrorState = ({ error, onRetry }: ErrorStateProps) => {
  return (
    <Card className="p-8 text-center">
      <div className="flex flex-col items-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium mb-2">Error Loading Documents</h3>
        <p className="text-muted-foreground mb-4">
          {error.message || "An error occurred while loading your documents."}
        </p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            Try Again
          </Button>
        )}
      </div>
    </Card>
  );
};
