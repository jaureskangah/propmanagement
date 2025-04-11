
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
  
  const handleEvent = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };
  
  return (
    <>
      <div 
        className="flex flex-wrap gap-2 justify-between" 
        onClick={handleEvent}
        onMouseDown={handleEvent}
        onMouseUp={handleEvent}
      >
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8"
          onClick={(e) => {
            e.stopPropagation();
            onViewPhotos(e);
          }}
          onMouseDown={handleEvent}
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
            onMouseDown={handleEvent}
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
                onClick={handleEvent}
                onMouseDown={handleEvent}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              onClick={handleEvent}
              onMouseDown={handleEvent}
            >
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onEdit(e);
              }}>
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onDelete(e);
              }}>
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
};
