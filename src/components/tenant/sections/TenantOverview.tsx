
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Calendar, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import type { Communication, MaintenanceRequest } from "@/types/tenant";
import type { TenantData } from "@/hooks/tenant/dashboard/useTenantData";

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
  const { t } = useLocale();

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

  const pendingRequests = maintenanceRequests.filter(req => 
    req.status === 'Pending' || req.status === 'pending'
  ).length;

  const getPropertyDisplayName = () => {
    console.log("=== TenantOverview getPropertyDisplayName ===");
    console.log("Tenant ID:", tenant.id);
    console.log("Property ID:", tenant.property_id);
    console.log("Properties object:", tenant.properties);
    console.log("Property name:", tenant.properties?.name);
    
    // Maintenant que la politique RLS est correcte, les données devraient être disponibles
    if (tenant.properties?.name) {
      console.log("✅ Property name found:", tenant.properties.name);
      return tenant.properties.name;
    }
    
    console.log("❌ No property name available");
    return "Propriété non disponible";
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
                {t('leaseStatus')}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative space-y-3">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getLeaseStatusColor()}`}>
                {getLeaseStatusIcon()}
                <span className="font-medium">
                  {leaseStatus.status === 'expired' ? t('leaseExpired') :
                   leaseStatus.status === 'expiring' ? t('leaseExpiring') :
                   t('leaseActive')}
                </span>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <p><strong>{t('leaseStart')}:</strong> {formatDate(tenant.lease_start)}</p>
                <p><strong>{t('leaseEnd')}:</strong> {formatDate(tenant.lease_end)}</p>
                {leaseStatus.status !== 'expired' && (
                  <p><strong>{t('daysRemaining')}:</strong> {leaseStatus.daysLeft} jours</p>
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
                {t('maintenance')}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{pendingRequests}</span>
                <Badge variant={pendingRequests > 0 ? "destructive" : "secondary"}>
                  {pendingRequests > 0 ? t('pending') : t('allGood')}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {pendingRequests > 0 
                  ? `${pendingRequests} ${t('pendingRequests').toLowerCase()}`
                  : t('noMaintenanceIssues')
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
            <CardTitle className="text-lg">{t('recentActivity')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Recent maintenance requests */}
              {maintenanceRequests.slice(0, 3).map((request, index) => (
                <div key={request.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{request.title || request.issue}</p>
                    <p className="text-xs text-gray-500">{formatDate(request.created_at)}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {t(request.status.toLowerCase())}
                  </Badge>
                </div>
              ))}

              {maintenanceRequests.length === 0 && (
                <p className="text-center text-gray-500 py-4">{t('noRecentActivity')}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
