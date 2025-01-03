import React from 'react';
import { Download, ExternalLink, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDocumentActions } from "./hooks/useDocumentActions";

interface DocumentActionsProps {
  fileUrl: string;
  fileName: string;
  onDelete: () => void;
}

export const DocumentActions: React.FC<DocumentActionsProps> = ({
  fileUrl,
  fileName,
  onDelete
}) => {
  const { handleDownload, handleOpenInNewTab } = useDocumentActions();

  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleDownload(fileUrl, fileName)}
        title="Télécharger le document"
        className="hover:text-blue-600 hover:bg-blue-50"
      >
        <Download className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleOpenInNewTab(fileUrl, fileName)}
        title="Ouvrir dans un nouvel onglet"
        className="hover:text-blue-600 hover:bg-blue-50"
      >
        <ExternalLink className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        className="hover:text-red-600 hover:bg-red-50"
        title="Supprimer le document"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};