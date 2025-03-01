
import { Card, CardContent } from "@/components/ui/card";
import { useLocale } from "@/components/providers/LocaleProvider";

interface MaintenanceStatsProps {
  totalRequests: number;
  pendingRequests: number;
  resolvedRequests: number;
}

export const MaintenanceStats = ({ 
  totalRequests, 
  pendingRequests, 
  resolvedRequests 
}: MaintenanceStatsProps) => {
  const { t } = useLocale();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-blue-50 dark:bg-blue-900/20">
        <CardContent className="p-4 flex flex-col items-center">
          <p className="font-semibold text-lg">{totalRequests}</p>
          <p className="text-sm text-muted-foreground">{t('totalRequests')}</p>
        </CardContent>
      </Card>
      <Card className="bg-yellow-50 dark:bg-yellow-900/20">
        <CardContent className="p-4 flex flex-col items-center">
          <p className="font-semibold text-lg">{pendingRequests}</p>
          <p className="text-sm text-muted-foreground">{t('pendingRequests')}</p>
        </CardContent>
      </Card>
      <Card className="bg-green-50 dark:bg-green-900/20">
        <CardContent className="p-4 flex flex-col items-center">
          <p className="font-semibold text-lg">{resolvedRequests}</p>
          <p className="text-sm text-muted-foreground">{t('resolvedRequests')}</p>
        </CardContent>
      </Card>
    </div>
  );
};
