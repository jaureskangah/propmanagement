
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/LocaleProvider";

interface NotificationHeaderProps {
  onViewAll: () => void;
}

export const NotificationHeader = ({ onViewAll }: NotificationHeaderProps) => {
  const { t } = useLocale();
  
  return (
    <div className="flex items-center justify-between px-3 py-2">
      <h4 className="font-medium text-sm">{t('notificationCenter')}</h4>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 text-xs"
        onClick={onViewAll}
      >
        {t('viewAll')}
      </Button>
    </div>
  );
};
