
import React from "react";
import { Edit, Trash2, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/LocaleProvider";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface PropertyCardActionsProps {
  id: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewFinancials: (id: string) => void;
}

const PropertyCardActions = ({ 
  id, 
  onEdit, 
  onDelete, 
  onViewFinancials 
}: PropertyCardActionsProps) => {
  const { t } = useLocale();
  
  return (
    <div className="flex gap-1 mr-4">
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onViewFinancials(id);
              }}
              className="hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors h-6 w-6 rounded-full"
            >
              <DollarSign className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" align="center" sideOffset={5} className="z-50">
            <p>{t('viewFinancials')}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(id);
              }}
              className="hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-600 dark:hover:text-green-400 transition-colors h-6 w-6 rounded-full"
            >
              <Edit className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" align="center" sideOffset={5} className="z-50">
            <p>{t('editProperty')}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
              className="hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-colors h-6 w-6 rounded-full"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" align="center" sideOffset={5} className="z-50">
            <p>{t('deleteProperty')}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default PropertyCardActions;
