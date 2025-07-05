
import React from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useTenantListTranslations } from "@/hooks/useTenantListTranslations";

interface TenantActionsProps {
  onAddClick: () => void;
}

export const TenantActions = ({ onAddClick }: TenantActionsProps) => {
  const { t } = useTenantListTranslations();

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
};
