
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  FileImage, 
  CheckSquare,
  Trash2
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-wrap gap-2 justify-between w-full">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 flex-shrink-0"
              onClick={onViewPhotos}
              disabled={!hasPhotos}
            >
              <FileImage className="h-4 w-4 mr-1 sm:mr-2" />
              {!isMobile && <span>Photos</span>}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {hasPhotos ? "Voir les photos" : "Aucune photo disponible"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="flex items-center gap-2 flex-wrap">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 flex-shrink-0"
                onClick={onStatusUpdate}
              >
                <CheckSquare className="h-4 w-4 mr-1 sm:mr-2" />
                {!isMobile && <span>Mettre à jour</span>}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Mettre à jour le statut
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="h-8 flex-shrink-0 text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4 mr-1 sm:mr-2" />
                {!isMobile && <span>Supprimer</span>}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Supprimer cet ordre de travail
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
