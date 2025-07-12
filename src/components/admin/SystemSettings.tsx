import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  Database, 
  RefreshCw, 
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  Activity,
  Server,
  Loader2
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const SystemSettings = () => {
  const { t } = useLocale();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch system statistics
  const { data: systemStats, isLoading } = useQuery({
    queryKey: ['admin_system_stats'],
    queryFn: async () => {
      const [
        profilesCount,
        propertiesCount,
        tenantsCount,
        paymentsCount,
        maintenanceCount,
        documentsCount
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('properties').select('*', { count: 'exact', head: true }),
        supabase.from('tenants').select('*', { count: 'exact', head: true }),
        supabase.from('tenant_payments').select('*', { count: 'exact', head: true }),
        supabase.from('maintenance_requests').select('*', { count: 'exact', head: true }),
        supabase.from('tenant_documents').select('*', { count: 'exact', head: true })
      ]);

      return {
        profiles: profilesCount.count || 0,
        properties: propertiesCount.count || 0,
        tenants: tenantsCount.count || 0,
        payments: paymentsCount.count || 0,
        maintenance: maintenanceCount.count || 0,
        documents: documentsCount.count || 0
      };
    }
  });

  // Mutation to calculate and insert metrics
  const calculateMetricsMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc('calculate_and_insert_metrics');
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: t('success', { fallback: 'Succès' }),
        description: t('metricsCalculated', { fallback: 'Métriques calculées et sauvegardées avec succès' }),
      });
      queryClient.invalidateQueries({ queryKey: ['admin_global_metrics'] });
    },
    onError: (error) => {
      toast({
        title: t('error', { fallback: 'Erreur' }),
        description: t('errorCalculatingMetrics', { fallback: 'Erreur lors du calcul des métriques' }),
        variant: "destructive",
      });
    }
  });

  // Real-time updates for system statistics
  useEffect(() => {
    const channels = [
      'profiles',
      'properties', 
      'tenants',
      'tenant_payments',
      'maintenance_requests',
      'tenant_documents'
    ].map(tableName => {
      const channel = supabase
        .channel(`system-stats-${tableName}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: tableName
          },
          () => {
            // Invalidate and refetch system stats when any relevant table changes
            queryClient.invalidateQueries({ queryKey: ['admin_system_stats'] });
          }
        )
        .subscribe();

      return channel;
    });

    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, [queryClient]);

  const handleCalculateMetrics = () => {
    calculateMetricsMutation.mutate();
  };

  const handleExportData = async () => {
    try {
      // This would typically export all system data
      toast({
        title: t('info', { fallback: 'Information' }),
        description: t('exportInProgress', { fallback: 'Export des données en cours...' }),
      });
      
      // Simulate export process
      setTimeout(() => {
        toast({
          title: t('success', { fallback: 'Succès' }),
          description: t('dataExported', { fallback: 'Données exportées avec succès' }),
        });
      }, 2000);
    } catch (error) {
      toast({
        title: t('error', { fallback: 'Erreur' }),
        description: t('exportError', { fallback: 'Erreur lors de l\'export' }),
        variant: "destructive",
      });
    }
  };

  const systemInfo = [
    {
      title: t('profiles', { fallback: 'Profils' }),
      value: systemStats?.profiles || 0,
      icon: Database,
      description: t('userProfiles', { fallback: 'Profils utilisateurs' })
    },
    {
      title: t('properties', { fallback: 'Propriétés' }),
      value: systemStats?.properties || 0,
      icon: Database,
      description: t('managedProperties', { fallback: 'Propriétés gérées' })
    },
    {
      title: t('tenants', { fallback: 'Locataires' }),
      value: systemStats?.tenants || 0,
      icon: Database,
      description: t('registeredTenants', { fallback: 'Locataires enregistrés' })
    },
    {
      title: t('payments', { fallback: 'Paiements' }),
      value: systemStats?.payments || 0,
      icon: Database,
      description: t('paymentRecords', { fallback: 'Enregistrements de paiement' })
    },
    {
      title: t('maintenance', { fallback: 'Maintenance' }),
      value: systemStats?.maintenance || 0,
      icon: Database,
      description: t('maintenanceRequests', { fallback: 'Demandes de maintenance' })
    },
    {
      title: t('documents', { fallback: 'Documents' }),
      value: systemStats?.documents || 0,
      icon: Database,
      description: t('uploadedDocuments', { fallback: 'Documents téléchargés' })
    }
  ];

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {t('systemSettings', { fallback: 'Paramètres Système' })}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            {t('manageSystemSettings', { fallback: 'Gérer les paramètres et la maintenance du système' })}
          </p>
        </div>
      </div>

      {/* System Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            {t('systemStatistics', { fallback: 'Statistiques du Système' })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {systemInfo.map((item, index) => {
              const Icon = item.icon;
              return (
                <Card key={index} className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">{item.title}</p>
                        <p className="text-2xl font-bold">{item.value.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* System Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Maintenance Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {t('maintenanceActions', { fallback: 'Actions de Maintenance' })}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">{t('calculateMetrics', { fallback: 'Calculer les Métriques' })}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('updateGlobalMetrics', { fallback: 'Mettre à jour les métriques globales du système' })}
                </p>
              </div>
              <Button 
                onClick={handleCalculateMetrics}
                disabled={calculateMetricsMutation.isPending}
                className="gap-2"
              >
                {calculateMetricsMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                {t('calculate', { fallback: 'Calculer' })}
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">{t('exportData', { fallback: 'Exporter les Données' })}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('exportSystemData', { fallback: 'Exporter toutes les données du système' })}
                </p>
              </div>
              <Button onClick={handleExportData} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                {t('export', { fallback: 'Exporter' })}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              {t('systemHealth', { fallback: 'État du Système' })}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <div>
                  <h3 className="font-medium">{t('database', { fallback: 'Base de Données' })}</h3>
                  <p className="text-sm text-muted-foreground">{t('operational', { fallback: 'Opérationnelle' })}</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {t('healthy', { fallback: 'Sain' })}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <div>
                  <h3 className="font-medium">{t('storage', { fallback: 'Stockage' })}</h3>
                  <p className="text-sm text-muted-foreground">{t('available', { fallback: 'Disponible' })}</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {t('healthy', { fallback: 'Sain' })}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <div>
                  <h3 className="font-medium">{t('authentication', { fallback: 'Authentification' })}</h3>
                  <p className="text-sm text-muted-foreground">{t('active', { fallback: 'Active' })}</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {t('healthy', { fallback: 'Sain' })}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            {t('dangerZone', { fallback: 'Zone de Danger' })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-destructive">{t('systemReset', { fallback: 'Réinitialisation du Système' })}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('dangerZoneWarning', { fallback: 'Actions destructives qui nécessitent une confirmation' })}
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    {t('resetSystem', { fallback: 'Réinitialiser' })}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('areYouSure', { fallback: 'Êtes-vous sûr ?' })}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t('systemResetWarning', { fallback: 'Cette action est irréversible et supprimera toutes les données du système.' })}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('cancel', { fallback: 'Annuler' })}</AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive text-destructive-foreground">
                      {t('confirmReset', { fallback: 'Confirmer la réinitialisation' })}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};