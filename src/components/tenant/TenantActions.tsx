
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, UserPlus } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

interface TenantActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  onInvite: () => void;
}

export const TenantActions = ({ onEdit, onDelete, onInvite }: TenantActionsProps) => {
  const { t } = useLocale();

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onInvite}
        className="flex items-center gap-1"
      >
        <UserPlus className="h-4 w-4" />
        {t('invite')}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onEdit}
        className="flex items-center gap-1"
      >
        <Edit className="h-4 w-4" />
        {t('edit')}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onDelete}
        className="flex items-center gap-1 text-red-600 hover:text-red-700"
      >
        <Trash2 className="h-4 w-4" />
        {t('delete')}
      </Button>
    </div>
  );
};
