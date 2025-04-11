
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  FileImage, 
  CheckSquare,
  Trash2
} from "lucide-react";

interface WorkOrderActionsProps {
  hasPhotos: boolean;
  onViewPhotos: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStatusUpdate: () => void;
}

export const WorkOrderActions = ({ 
  hasPhotos, 
  onViewPhotos, 
  onEdit, 
  onDelete, 
  onStatusUpdate 
}: WorkOrderActionsProps) => {
  return (
    <div className="flex flex-wrap gap-2 justify-between w-full">
      <Button 
        variant="outline" 
        size="sm" 
        className="h-8 flex-shrink-0"
        onClick={onViewPhotos}
        disabled={!hasPhotos}
      >
        <FileImage className="h-4 w-4 mr-1 sm:mr-2" />
        <span className="hidden xs:inline">Photos</span>
      </Button>

      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 flex-shrink-0"
          onClick={onStatusUpdate}
        >
          <CheckSquare className="h-4 w-4 mr-1 sm:mr-2" />
          <span className="hidden xs:inline">Mettre à jour</span>
        </Button>

        <Button 
          variant="outline" 
          size="sm"
          className="h-8 flex-shrink-0 text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4 mr-1 sm:mr-2" />
          <span className="hidden xs:inline">Supprimer</span>
        </Button>
      </div>
    </div>
  );
};
