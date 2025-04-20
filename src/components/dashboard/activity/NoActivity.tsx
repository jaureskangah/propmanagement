
import { useLocale } from "@/components/providers/LocaleProvider";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface NoActivityProps {
  onReset?: () => void;
}

export const NoActivity = ({ onReset }: NoActivityProps) => {
  const { t } = useLocale();

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="mb-4 rounded-full bg-muted p-3">
        <div className="rounded-full bg-background p-2">
          <RefreshCw className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>
      <h3 className="mb-2 text-xl font-semibold">{t('noRecentActivity')}</h3>
      <p className="mb-6 max-w-md text-muted-foreground">
        {t('noActivityDescription')}
      </p>
      
      {onReset && (
        <Button 
          variant="outline" 
          onClick={onReset}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          {t('refreshView')}
        </Button>
      )}
    </div>
  );
};
