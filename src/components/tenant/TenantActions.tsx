
import React from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, Edit, Trash2, Mail } from "lucide-react";
import { useTenantListTranslations } from "@/hooks/useTenantListTranslations";
import { useLocale } from "@/components/providers/LocaleProvider";

interface TenantActionsProps {
  onAddClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onInvite?: () => void;
}

export const TenantActions = ({ onAddClick, onEdit, onDelete, onInvite }: TenantActionsProps) => {
  const { t } = useTenantListTranslations();
  const { t: tCommon } = useLocale();

  // Si on a onAddClick, c'est le bouton d'ajout principal
  if (onAddClick) {
    return (
      <div className="flex items-center gap-2">
        <Button 
          className="flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200" 
          onClick={onAddClick}
        >
          <UserPlus className="h-4 w-4" />
          {t('addTenant')}
        </Button>
      </div>
    );
  }

  // Sinon, c'est les actions de la carte tenant
  return (
    <div className="flex items-center gap-2">
      {onEdit && (
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="flex items-center gap-1"
        >
          <Edit className="h-3 w-3" />
          {tCommon('modify')}
        </Button>
      )}
      {onDelete && (
        <Button
          variant="outline"
          size="sm"
          onClick={onDelete}
          className="flex items-center gap-1 text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-3 w-3" />
          {tCommon('delete')}
        </Button>
      )}
      {onInvite && (
        <Button
          variant="outline"
          size="sm"
          onClick={onInvite}
          className="flex items-center gap-1"
        >
          <Mail className="h-3 w-3" />
          {tCommon('invite')}
        </Button>
      )}
    </div>
  );
};
