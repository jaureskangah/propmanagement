import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Loader2, User, MapPin, Calendar, DollarSign } from "lucide-react";
import { GlobalExportOptions } from "../shared/GlobalExportOptions";
import { format, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";

export const TenantReports = () => {
  const { t, language } = useLocale();
  const locale = language === 'fr' ? fr : undefined;

  // Fetch tenants and related data
  const { data: tenants = [], isLoading: isLoadingTenants } = useQuery({
    queryKey: ['tenant_reports'],
    queryFn: async () => {
      const { data, error } = await supabase.from('tenants').select('*, properties(name, address)');
      if (error) throw error;
      return data;
    }
  });

  const { data: payments = [], isLoading: isLoadingPayments } = useQuery({
    queryKey: ['tenant_payments_reports'],
    queryFn: async () => {
      const { data, error } = await supabase.from('tenant_payments').select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: communications = [], isLoading: isLoadingCommunications } = useQuery({
    queryKey: ['tenant_communications_reports'],
    queryFn: async () => {
      const { data, error } = await supabase.from('tenant_communications').select('*');
      if (error) throw error;
      return data;
    }
  });

  const isLoading = isLoadingTenants || isLoadingPayments || isLoadingCommunications;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  const tenantData = {
    tenants,
    payments,
    communications
  };

  // Calculate tenant metrics
  const tenantMetrics = tenants.map(tenant => {
    const tenantPayments = payments.filter(payment => payment.tenant_id === tenant.id);
    const tenantCommunications = communications.filter(comm => comm.tenant_id === tenant.id);
    
    const totalPaid = tenantPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
    const lastPayment = tenantPayments.length > 0 ? 
      Math.max(...tenantPayments.map(p => new Date(p.payment_date).getTime())) : null;
    
    const leaseEnd = new Date(tenant.lease_end);
    const today = new Date();
    const daysUntilLeaseEnd = differenceInDays(leaseEnd, today);
    
    const unreadCommunications = tenantCommunications.filter(comm => comm.status === 'unread').length;

    return {
      ...tenant,
      totalPaid,
      lastPayment: lastPayment ? new Date(lastPayment) : null,
      daysUntilLeaseEnd,
      unreadCommunications,
      paymentCount: tenantPayments.length,
      communicationCount: tenantCommunications.length
    };
  });

  // Sort tenants by lease end date
  const sortedTenants = [...tenantMetrics].sort((a, b) => a.daysUntilLeaseEnd - b.daysUntilLeaseEnd);

  return (
    <div className="space-y-6">
      {/* Header with export options */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {t('tenantReports', { fallback: 'Rapports Locataires' })}
          </h2>
          <p className="text-muted-foreground">
            {t('detailedTenantAnalysis', { fallback: 'Analyse détaillée des locataires' })}
          </p>
        </div>
        <GlobalExportOptions data={tenantData} type="tenant" />
      </div>

      {/* Lease Expiry Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-orange-600" />
            {t('leaseExpiryAlerts', { fallback: 'Alertes Fin de Bail' })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedTenants.filter(tenant => tenant.daysUntilLeaseEnd <= 90 && tenant.daysUntilLeaseEnd >= 0).map(tenant => (
              <div key={tenant.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{tenant.name}</p>
                  <p className="text-sm text-muted-foreground">{tenant.properties?.name}</p>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${
                    tenant.daysUntilLeaseEnd <= 30 ? 'text-red-600' :
                    tenant.daysUntilLeaseEnd <= 60 ? 'text-orange-600' : 'text-yellow-600'
                  }`}>
                    {tenant.daysUntilLeaseEnd} {t('daysLeft', { fallback: 'jours restants' })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(tenant.lease_end), 'dd/MM/yyyy', { locale })}
                  </p>
                </div>
              </div>
            ))}
            {sortedTenants.filter(tenant => tenant.daysUntilLeaseEnd <= 90 && tenant.daysUntilLeaseEnd >= 0).length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                {t('noUpcomingLeaseExpiry', { fallback: 'Aucune fin de bail prochaine' })}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tenant Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tenantMetrics.map((tenant) => (
          <Card key={tenant.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                {tenant.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{tenant.email}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Property Info */}
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{tenant.properties?.name}</span>
                </div>

                {/* Lease Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">{t('rentAmount', { fallback: 'Loyer' })}</p>
                    <p className="text-muted-foreground">${tenant.rent_amount?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="font-medium">{t('unit', { fallback: 'Unité' })}</p>
                    <p className="text-muted-foreground">{tenant.unit_number}</p>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span>{t('totalPaid', { fallback: 'Total payé' })}</span>
                    </div>
                    <span className="font-medium">${tenant.totalPaid.toLocaleString()}</span>
                  </div>
                  
                  {tenant.lastPayment && (
                    <p className="text-xs text-muted-foreground">
                      {t('lastPayment', { fallback: 'Dernier paiement' })}: {format(tenant.lastPayment, 'dd/MM/yyyy', { locale })}
                    </p>
                  )}
                </div>

                {/* Lease Status */}
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="flex justify-between items-center text-sm">
                    <span>{t('leaseStatus', { fallback: 'Statut du bail' })}</span>
                    <span className={`font-medium ${
                      tenant.daysUntilLeaseEnd < 0 ? 'text-red-600' :
                      tenant.daysUntilLeaseEnd <= 30 ? 'text-orange-600' : 'text-green-600'
                    }`}>
                      {tenant.daysUntilLeaseEnd < 0 ? 
                        t('expired', { fallback: 'Expiré' }) :
                        `${tenant.daysUntilLeaseEnd} ${t('days', { fallback: 'jours' })}`
                      }
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(tenant.lease_start), 'dd/MM/yyyy', { locale })} - {format(new Date(tenant.lease_end), 'dd/MM/yyyy', { locale })}
                  </p>
                </div>

                {/* Communication Badges */}
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {tenant.paymentCount} {t('payments', { fallback: 'paiements' })}
                  </span>
                  {tenant.unreadCommunications > 0 && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      {tenant.unreadCommunications} {t('unread', { fallback: 'non lu' })}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};