
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, UserPlus, Plus } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface TenantActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onInvite?: () => void;
  onAddClick?: () => void;
}

export const TenantActions = ({ onEdit, onDelete, onInvite, onAddClick }: TenantActionsProps) => {
  const { t } = useLocale();

  // Si c'est pour l'en-tête (avec onAddClick), afficher le bouton d'ajout
  if (onAddClick) {
    return (
      <Button
        variant="default"
        size="sm"
        onClick={onAddClick}
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        {t('addTenant')}
      </Button>
    );
  }

  // Sinon, afficher les actions pour un tenant spécifique avec icônes uniquement et tooltips
  return (
    <div className="flex gap-2">
      {onInvite && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onInvite}
              className="flex items-center"
            >
              <UserPlus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('invite')}</p>
          </TooltipContent>
        </Tooltip>
      )}
      {onEdit && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="flex items-center"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('edit')}</p>
          </TooltipContent>
        </Tooltip>
      )}
      {onDelete && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="flex items-center text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('delete')}</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};
