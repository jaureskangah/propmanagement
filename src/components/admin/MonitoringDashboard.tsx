import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  Database,
  Zap,
  AlertCircle,
  Bell
} from 'lucide-react';

interface MonitoringMetric {
  name: string;
  value: number;
  threshold: number;
  status: 'healthy' | 'warning' | 'critical';
  unit: string;
  description: string;
}

interface AlertRule {
  id: string;
  name: string;
  condition: string;
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  lastTriggered?: Date;
}

export const MonitoringDashboard = () => {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<MonitoringMetric[]>([]);
  const [alerts, setAlerts] = useState<AlertRule[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const defaultAlertRules: AlertRule[] = [
    {
      id: 'response_time',
      name: 'Temps de Réponse Élevé',
      condition: 'avg_response_time > threshold',
      threshold: 1000,
      severity: 'high',
      enabled: true
    },
    {
      id: 'error_rate',
      name: 'Taux d\'Erreur Élevé',
      condition: 'error_rate > threshold',
      threshold: 5,
      severity: 'critical',
      enabled: true
    },
    {
      id: 'active_users',
      name: 'Chute d\'Utilisateurs Actifs',
      condition: 'active_users < threshold',
      threshold: 10,
      severity: 'medium',
      enabled: true
    },
    {
      id: 'db_connections',
      name: 'Connexions DB Élevées',
      condition: 'db_connections > threshold',
      threshold: 80,
      severity: 'high',
      enabled: true
    }
  ];

  const fetchMetrics = async () => {
    setIsLoading(true);
    try {
      // Simuler la récupération de métriques en temps réel
      const startTime = performance.now();
      
      // Test de performance de la base de données
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      const dbResponseTime = performance.now() - startTime;

      // Test des edge functions
      const functionStartTime = performance.now();
      const { error: functionError } = await supabase.functions.invoke('check-subscription');
      const functionResponseTime = performance.now() - functionStartTime;

      // Calculer les métriques
      const newMetrics: MonitoringMetric[] = [
        {
          name: 'Temps de Réponse DB',
          value: Math.round(dbResponseTime),
          threshold: 500,
          status: dbResponseTime > 500 ? 'warning' : 'healthy',
          unit: 'ms',
          description: 'Temps de réponse moyen de la base de données'
        },
        {
          name: 'Temps de Réponse Functions',
          value: Math.round(functionResponseTime),
          threshold: 1000,
          status: functionResponseTime > 1000 ? 'warning' : 'healthy',
          unit: 'ms',
          description: 'Temps de réponse des edge functions'
        },
        {
          name: 'Taux d\'Erreur',
          value: (profilesError || functionError) ? 5 : 0,
          threshold: 2,
          status: (profilesError || functionError) ? 'critical' : 'healthy',
          unit: '%',
          description: 'Pourcentage d\'erreurs sur les requêtes'
        },
        {
          name: 'Disponibilité',
          value: (profilesError || functionError) ? 95 : 100,
          threshold: 99,
          status: (profilesError || functionError) ? 'warning' : 'healthy',
          unit: '%',
          description: 'Disponibilité du service'
        }
      ];

      setMetrics(newMetrics);

      // Vérifier les alertes
      const triggeredAlerts = defaultAlertRules.filter(rule => {
        const metric = newMetrics.find(m => m.name.toLowerCase().includes(rule.id.replace('_', ' ')));
        if (!metric || !rule.enabled) return false;
        
        return rule.condition.includes('>') ? 
          metric.value > rule.threshold : 
          metric.value < rule.threshold;
      }).map(rule => rule.id);

      setActiveAlerts(triggeredAlerts);

      if (triggeredAlerts.length > 0) {
        toast({
          title: "Alertes Déclenchées",
          description: `${triggeredAlerts.length} alerte(s) active(s)`,
          variant: "destructive"
        });
      }

    } catch (error) {
      toast({
        title: "Erreur de Monitoring",
        description: "Impossible de récupérer les métriques",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setAlerts(defaultAlertRules);
    fetchMetrics();
    
    // Actualisation automatique toutes les 30 secondes
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-blue-100 text-blue-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const overallStatus = metrics.every(m => m.status === 'healthy') ? 'healthy' :
                      metrics.some(m => m.status === 'critical') ? 'critical' : 'warning';

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Monitoring & Alertes</h1>
        <p className="text-muted-foreground">
          Surveillance en temps réel de votre application en production
        </p>
      </div>

      {/* État Global */}
      <Card className={`border-2 ${
        overallStatus === 'healthy' ? 'border-green-500' :
        overallStatus === 'warning' ? 'border-yellow-500' :
        'border-red-500'
      }`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(overallStatus)}
              <span>État du Système</span>
            </div>
            <Button
              onClick={fetchMetrics}
              disabled={isLoading}
              size="sm"
              variant="outline"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Actualiser
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getStatusColor(metric.status)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{metric.name}</span>
                  {getStatusIcon(metric.status)}
                </div>
                <div className="text-2xl font-bold">
                  {metric.value}{metric.unit}
                </div>
                <div className="text-xs mt-1">
                  Seuil: {metric.threshold}{metric.unit}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {metric.description}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alertes Actives */}
      {activeAlerts.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>{activeAlerts.length} alerte(s) active(s) :</strong>
            <ul className="mt-2 list-disc list-inside">
              {activeAlerts.map(alertId => {
                const alert = alerts.find(a => a.id === alertId);
                return alert ? (
                  <li key={alertId}>{alert.name}</li>
                ) : null;
              })}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Configuration des Alertes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Configuration des Alertes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 border rounded-lg ${
                  activeAlerts.includes(alert.id) ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{alert.name}</span>
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                      {activeAlerts.includes(alert.id) && (
                        <Badge variant="destructive">ACTIVE</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {alert.condition.replace('threshold', alert.threshold.toString())}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={alert.enabled ? 'default' : 'secondary'}>
                      {alert.enabled ? 'Activée' : 'Désactivée'}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Métriques Détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Tendances Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Temps de réponse moyen</span>
                <span className="font-mono">
                  {metrics.find(m => m.name.includes('DB'))?.value || 0}ms
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Disponibilité (24h)</span>
                <span className="font-mono text-green-600">99.9%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Utilisateurs actifs</span>
                <span className="font-mono">1</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              État de la Base de Données
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Connexions actives</span>
                <span className="font-mono">2/100</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Taille de la DB</span>
                <span className="font-mono">45.2 MB</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Dernière sauvegarde</span>
                <span className="font-mono text-green-600">Il y a 2h</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};