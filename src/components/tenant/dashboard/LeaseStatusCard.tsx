
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useSafeTranslation } from "@/hooks/useSafeTranslation";

interface LeaseStatusCardProps {
  leaseStart: string;
  leaseEnd: string;
  daysLeft: number;
  status: 'active' | 'expiring' | 'expired';
}

export const LeaseStatusCard = ({ 
  leaseStart, 
  leaseEnd, 
  daysLeft, 
  status 
}: LeaseStatusCardProps) => {
  const { t } = useSafeTranslation();

  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'expiring':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'expiring':
        return <Clock className="h-4 w-4" />;
      case 'expired':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'active':
        return t('leaseActive', 'Bail actif');
      case 'expiring':
        return t('leaseExpiring', 'Bail expirant');
      case 'expired':
        return t('leaseExpired', 'Bail expiré');
      default:
        return t('leaseStatus', 'Statut du bail');
    }
  };

  const getDaysText = () => {
    if (status === 'expired') {
      return t('expiredDaysAgo', `Expiré depuis ${daysLeft} jour(s)`);
    } else if (status === 'expiring') {
      return t('expiringInDays', `Expire dans ${daysLeft} jour(s)`);
    } else {
      return t('daysRemaining', `${daysLeft} jour(s) restant(s)`);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            {t('leaseInformation', 'Informations du bail')}
          </CardTitle>
          <Badge className={`${getStatusColor()} flex items-center gap-1`}>
            {getStatusIcon()}
            {getStatusText()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {t('leaseStart', 'Début du bail')}
            </p>
            <p className="text-base font-semibold">
              {new Date(leaseStart).toLocaleDateString('fr-FR')}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {t('leaseEnd', 'Fin du bail')}
            </p>
            <p className="text-base font-semibold">
              {new Date(leaseEnd).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              {t('timeRemaining', 'Temps restant')}
            </span>
            <span className={`text-base font-semibold ${
              status === 'expired' ? 'text-red-600' : 
              status === 'expiring' ? 'text-yellow-600' : 
              'text-green-600'
            }`}>
              {getDaysText()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
