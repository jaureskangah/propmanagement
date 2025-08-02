import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ProductionChecker, ProductionCheckResult } from '@/utils/productionCheck';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RefreshCw,
  Database,
  Shield,
  Zap,
  CreditCard,
  Gauge,
  Server
} from 'lucide-react';

export const ProductionDashboard = () => {
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<ProductionCheckResult[]>([]);
  const [checker] = useState(new ProductionChecker());

  const runChecks = async () => {
    setIsChecking(true);
    try {
      const checkResults = await checker.runAllChecks();
      setResults(checkResults);
      
      const status = checker.getOverallStatus();
      const message = status === 'healthy' ? 
        'Tous les systèmes fonctionnent correctement' :
        status === 'warning' ? 
        'Quelques optimisations recommandées' :
        'Problèmes critiques détectés';
        
      toast({
        title: "Vérification terminée",
        description: message,
        variant: status === 'critical' ? 'destructive' : 'default'
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'effectuer les vérifications",
        variant: "destructive"
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    runChecks();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Database':
        return <Database className="h-5 w-5 text-blue-500" />;
      case 'Auth':
        return <Shield className="h-5 w-5 text-green-500" />;
      case 'Security':
        return <Shield className="h-5 w-5 text-purple-500" />;
      case 'Functions':
        return <Zap className="h-5 w-5 text-orange-500" />;
      case 'Payments':
        return <CreditCard className="h-5 w-5 text-indigo-500" />;
      case 'Performance':
        return <Gauge className="h-5 w-5 text-teal-500" />;
      default:
        return <Server className="h-5 w-5 text-gray-500" />;
    }
  };

  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = [];
    }
    acc[result.category].push(result);
    return acc;
  }, {} as Record<string, ProductionCheckResult[]>);

  const overallStatus = checker.getOverallStatus();
  const successCount = checker.getSuccessCount();
  const warningCount = checker.getWarningCount();
  const errorCount = checker.getErrorCount();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Tableau de Bord Production</h1>
        <p className="text-muted-foreground">
          Vérification de la santé de votre application en production
        </p>
      </div>

      {/* Status Global */}
      <Card className={
        overallStatus === 'healthy' ? 'ring-2 ring-green-500' :
        overallStatus === 'warning' ? 'ring-2 ring-yellow-500' :
        'ring-2 ring-red-500'
      }>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {overallStatus === 'healthy' ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : overallStatus === 'warning' ? (
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
            ) : (
              <XCircle className="h-6 w-6 text-red-500" />
            )}
            État Global de Production
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Badge variant={overallStatus === 'healthy' ? 'default' : overallStatus === 'warning' ? 'secondary' : 'destructive'}>
                {overallStatus === 'healthy' ? 'Sain' : overallStatus === 'warning' ? 'Attention' : 'Critique'}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{successCount}</div>
              <div className="text-sm text-muted-foreground">Succès</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">{warningCount}</div>
              <div className="text-sm text-muted-foreground">Avertissements</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">{errorCount}</div>
              <div className="text-sm text-muted-foreground">Erreurs</div>
            </div>
          </div>
          <div className="mt-4">
            <Button 
              onClick={runChecks} 
              disabled={isChecking}
              className="flex items-center gap-2"
            >
              {isChecking ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Relancer les Vérifications
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Détails par Catégorie */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(groupedResults).map(([category, categoryResults]) => (
          <Card key={category}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                {getCategoryIcon(category)}
                {category}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {categoryResults.map((result, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  {getStatusIcon(result.status)}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{result.check}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {result.message}
                    </div>
                    {result.action && (
                      <div className="text-xs text-blue-600 mt-1 font-medium">
                        Action: {result.action}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommandations pour la Production</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Sécurité</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• RLS activé sur toutes les tables sensibles</li>
                <li>• Secrets Stripe configurés correctement</li>
                <li>• Edge functions sécurisées</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Performance</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Requêtes optimisées (&lt;500ms)</li>
                <li>• Index sur les colonnes fréquemment utilisées</li>
                <li>• Mise en cache appropriée</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Monitoring</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Surveillance des erreurs actives</li>
                <li>• Alertes sur les métriques critiques</li>
                <li>• Logs centralisés</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Backup</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Sauvegardes automatiques quotidiennes</li>
                <li>• Point-in-time recovery activé</li>
                <li>• Tests de restauration réguliers</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};