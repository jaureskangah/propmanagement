
import { AlertTriangle, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  onRetry: () => void;
  onDownload?: () => void;
  errorMessage?: string;
}

export function ErrorState({ onRetry, onDownload, errorMessage }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[500px] border border-dashed rounded-md p-4 bg-background dark:bg-gray-800">
      <div className="bg-amber-100 p-4 rounded-full mb-4 dark:bg-amber-900/30">
        <AlertTriangle className="h-12 w-12 text-amber-500" />
      </div>
      <h3 className="text-lg font-medium mb-2">Impossible d'afficher le PDF</h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        {errorMessage || "Le document ne peut pas être affiché. Vous pouvez réessayer ou télécharger directement le document."}
      </p>
      <div className="flex space-x-3">
        <Button 
          onClick={onRetry}
          variant="outline"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Réessayer
        </Button>
        {onDownload && (
          <Button 
            onClick={onDownload}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Download className="mr-2 h-4 w-4" /> Télécharger
          </Button>
        )}
      </div>
    </div>
  );
}
