
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
      case 'expired': return 'bg-red-500/10 text-red-700 border-red-200';
      case 'expiring': return 'bg-orange-500/10 text-orange-700 border-orange-200';
      default: return 'bg-green-500/10 text-green-700 border-green-200';
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
    <div className="space-y-6">
      {/* Status Cards Grid - 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lease Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
                {t('leaseStatus', 'Statut du bail')}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative space-y-3">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getLeaseStatusColor()}`}>
                {getLeaseStatusIcon()}
                <span className="font-medium">
                  {getLeaseStatusText()}
                </span>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <p><strong>{t('leaseStart', 'Début du bail')}:</strong> {formatLeaseDate(tenant.lease_start)}</p>
                <p><strong>{t('leaseEnd', 'Fin du bail')}:</strong> {formatLeaseDate(tenant.lease_end)}</p>
                {leaseStatus.status !== 'expired' && (
                  <p><strong>{t('daysRemaining', 'Jours restants')}:</strong> {leaseStatus.daysLeft} jours</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Maintenance Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                {t('maintenance', 'Maintenance')}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{pendingRequests}</span>
                <Badge variant={pendingRequests > 0 ? "destructive" : "secondary"}>
                  {pendingRequests > 0 ? t('pending', 'En attente') : t('allGood', 'Tout va bien')}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mt-2">
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
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
          <CardHeader>
            <CardTitle className="text-lg">{t('recentActivity', 'Activité récente')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Recent maintenance requests */}
              {maintenanceRequests.slice(0, 3).map((request, index) => (
                <div key={request.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{request.title || request.issue}</p>
                    <p className="text-xs text-gray-500">{formatDate(request.created_at, language)}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {/* Translate status here too */}
                    {request.status?.toLowerCase() === 'resolved' ? (language === 'fr' ? 'Résolue' : 'Resolved') :
                     request.status?.toLowerCase() === 'in progress' ? (language === 'fr' ? 'En cours' : 'In Progress') :
                     request.status?.toLowerCase() === 'pending' ? (language === 'fr' ? 'En attente' : 'Pending') :
                     request.status}
                  </Badge>
                </div>
              ))}

              {maintenanceRequests.length === 0 && (
                <p className="text-center text-gray-500 py-4">{t('noRecentActivity', 'Aucune activité récente')}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
