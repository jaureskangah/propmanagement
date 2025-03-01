
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, AlertTriangle, CheckCircle } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

interface LeaseStatusCardProps {
  leaseStart: string;
  leaseEnd: string;
  daysLeft: number;
  status: 'active' | 'expiring' | 'expired';
}

export const LeaseStatusCard = ({ leaseStart, leaseEnd, daysLeft, status }: LeaseStatusCardProps) => {
  const { t } = useLocale();
  
  return (
    <Card className="shadow-sm transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          {status === 'active' && t('leaseStatusActive')}
          {status === 'expiring' && t('leaseStatusExpiringDays', { days: daysLeft })}
          {status === 'expired' && t('leaseStatusExpired', { days: daysLeft })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{t('lease.start')}</span>
            <span className="font-medium">{new Date(leaseStart).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{t('lease.end')}</span>
            <span className="font-medium">{new Date(leaseEnd).toLocaleDateString()}</span>
          </div>
          <div className="mt-4 flex items-center">
            {status === 'active' && (
              <div className="flex items-center text-green-500">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span className="text-sm">{t('daysLeft', { days: daysLeft })}</span>
              </div>
            )}
            {status === 'expiring' && (
              <div className="flex items-center text-amber-500">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <span className="text-sm">{t('daysLeft', { days: daysLeft })}</span>
              </div>
            )}
            {status === 'expired' && (
              <div className="flex items-center text-red-500">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <span className="text-sm">{t('daysAgo', { days: daysLeft })}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
