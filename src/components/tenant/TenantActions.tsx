
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

interface TenantActionsProps {
  onAddClick: () => void;
}

export const TenantActions = ({ onAddClick }: TenantActionsProps) => {
  const { t } = useLocale();
  
  return (
    <div className="flex justify-end">
      <Button 
        size="sm"
        className="flex items-center gap-2 transition-transform hover:scale-105 animate-fade-in"
        onClick={onAddClick}
      >
        <Plus className="h-4 w-4" />
        {t('list.addTenant')}
      </Button>
    </div>
  );
};
