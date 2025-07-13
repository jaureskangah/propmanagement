

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Calendar, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useSafeTranslation } from "@/hooks/useSafeTranslation";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import { useMemo } from "react";
import type { Communication, MaintenanceRequest } from "@/types/tenant";
import type { TenantData } from "@/hooks/tenant/dashboard/useTenantData";
import { useLocale } from "@/components/providers/LocaleProvider";

interface TenantOverviewProps {
  tenant: TenantData;
  leaseStatus: { daysLeft: number; status: 'active' | 'expiring' | 'expired' };
  maintenanceRequests: MaintenanceRequest[];
  communications: Communication[];
}

export const TenantOverview = ({
  tenant,
  leaseStatus,
  maintenanceRequests,
  communications
}: TenantOverviewProps) => {
  const { t } = useSafeTranslation();
  const { language } = useLocale();

  const getLeaseStatusColor = () => {
    switch (leaseStatus.status) {
      case 'expired': return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'expiring': return 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800';
      default: return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800';
    }
  };

  const getLeaseStatusIcon = () => {
    switch (leaseStatus.status) {
      case 'expired': return <XCircle className="h-5 w-5" />;
      case 'expiring': return <AlertTriangle className="h-5 w-5" />;
      default: return <CheckCircle className="h-5 w-5" />;
    }
  };

  // Format dates according to language
  const formatLeaseDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Memoized calculation to ensure consistency with container
  const pendingRequests = useMemo(() => {
    const pending = maintenanceRequests.filter(req => {
      const status = req.status?.toLowerCase();
      return status === 'pending' || status === 'in progress' || status === 'en attente' || status === 'en cours';
    }).length;
    
    console.log("TenantOverview - Calculated pending requests:", pending);
    
    return pending;
  }, [maintenanceRequests]);

  const getPropertyDisplayName = () => {
    console.log("=== TenantOverview getPropertyDisplayName ===");
    console.log("Tenant ID:", tenant.id);
    console.log("Property ID:", tenant.property_id);
    console.log("Properties object:", tenant.properties);
    console.log("Property name:", tenant.properties?.name);
    
    if (tenant.properties?.name) {
      console.log("✅ Property name found:", tenant.properties.name);
      return tenant.properties.name;
    }
    
    console.log("❌ No property name available");
    return "Propriété non disponible";
  };

  const getLeaseStatusText = () => {
    switch (leaseStatus.status) {
      case 'expired': return t('leaseExpired', 'Bail expiré');
      case 'expiring': return t('leaseExpiring', 'Bail bientôt expiré');
      default: return t('leaseActive', 'Bail actif');
    }
  };

  return (
    <div className="space-y-6 mobile-px-2">
      {/* Status Cards Grid - 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mobile-stack">
        {/* Lease Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card to-card/80 mobile-card-hover hover-scale">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20" />
            <CardHeader className="relative mobile-py-2">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg text-card-foreground">
                <Calendar className="h-4 w-4 md:h-5 md:w-5 text-blue-600 dark:text-blue-400" />
                {t('leaseStatus', 'Statut du bail')}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative space-y-3">
              {/* Only show lease status when we have actual lease data */}
              {tenant.lease_start && tenant.lease_end ? (
                <>
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getLeaseStatusColor()}`}>
                    {getLeaseStatusIcon()}
                    <span className="font-medium">
                      {getLeaseStatusText()}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p><strong>{t('leaseStart', 'Début du bail')}:</strong> {formatLeaseDate(tenant.lease_start)}</p>
                    <p><strong>{t('leaseEnd', 'Fin du bail')}:</strong> {formatLeaseDate(tenant.lease_end)}</p>
                    {leaseStatus.status !== 'expired' && leaseStatus.daysLeft !== null && (
                      <p><strong>{t('daysRemaining', 'Jours restants')}:</strong> {leaseStatus.daysLeft} jours</p>
                    )}
                  </div>
                </>
              ) : (
                <div className="animate-pulse space-y-3">
                  <div className="h-10 bg-muted rounded-lg"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Maintenance Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card to-card/80 mobile-card-hover hover-scale">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 dark:from-orange-500/20 dark:to-red-500/20" />
            <CardHeader className="relative mobile-py-2">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg text-card-foreground">
                <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-orange-600 dark:text-orange-400" />
                {t('maintenance', 'Maintenance')}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-foreground">{pendingRequests}</span>
                <Badge variant={pendingRequests > 0 ? "destructive" : "secondary"}>
                  {pendingRequests > 0 ? t('pending', 'En attente') : t('allGood', 'Tout va bien')}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {pendingRequests > 0 
                  ? `${pendingRequests} ${t('pendingRequests', 'demandes en attente').toLowerCase()}`
                  : t('noMaintenanceIssues', 'Aucun problème de maintenance')
                }
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80 mobile-card-hover">
          <CardHeader className="mobile-py-2">
            <CardTitle className="text-base md:text-lg text-card-foreground">{t('recentActivity', 'Activité récente')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Recent maintenance requests */}
              {maintenanceRequests.slice(0, 3).map((request, index) => (
                <motion.div 
                  key={request.id} 
                  className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border mobile-card-hover mobile-touch-target"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AlertTriangle className="h-4 w-4 text-orange-500 dark:text-orange-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-card-foreground">{request.title || request.issue}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(request.created_at, language)}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {/* Translate status here too */}
                    {request.status?.toLowerCase() === 'resolved' ? (language === 'fr' ? 'Résolue' : 'Resolved') :
                     request.status?.toLowerCase() === 'in progress' ? (language === 'fr' ? 'En cours' : 'In Progress') :
                     request.status?.toLowerCase() === 'pending' ? (language === 'fr' ? 'En attente' : 'Pending') :
                     request.status}
                  </Badge>
                </motion.div>
              ))}

              {maintenanceRequests.length === 0 && (
                <p className="text-center text-muted-foreground py-4">{t('noRecentActivity', 'Aucune activité récente')}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

