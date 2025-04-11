
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  FileImage, 
  CheckSquare,
  MoreVertical 
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface WorkOrderActionsProps {
  hasPhotos: boolean;
  onViewPhotos: (e: React.MouseEvent) => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  onStatusUpdate: (e: React.MouseEvent) => void;
}

export const WorkOrderActions = ({ 
  hasPhotos, 
  onViewPhotos, 
  onEdit, 
  onDelete, 
  onStatusUpdate 
}: WorkOrderActionsProps) => {
  return (
    <>
      <div className="flex flex-wrap gap-2 justify-between" onClick={(e) => e.stopPropagation()}>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8"
          onClick={(e) => {
            e.stopPropagation();
            onViewPhotos(e);
          }}
          disabled={!hasPhotos}
        >
          <FileImage className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Photos</span>
        </Button>

        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 mr-2"
            onClick={(e) => {
              e.stopPropagation();
              onStatusUpdate(e);
            }}
          >
            <CheckSquare className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Mettre à jour</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onEdit(e);
              }}>Modifier</DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onDelete(e);
              }}>Supprimer</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
};
