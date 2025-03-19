
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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4 flex flex-col">
          <span className="text-sm text-muted-foreground">{t('totalRequests')}</span>
          <span className="text-2xl font-bold">{totalRequests}</span>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex flex-col">
          <span className="text-sm text-muted-foreground">{t('pendingRequests')}</span>
          <span className="text-2xl font-bold text-yellow-500">{pendingRequests}</span>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex flex-col">
          <span className="text-sm text-muted-foreground">{t('resolvedRequests')}</span>
          <span className="text-2xl font-bold text-green-500">{resolvedRequests}</span>
        </CardContent>
      </Card>
    </div>
  );
};
