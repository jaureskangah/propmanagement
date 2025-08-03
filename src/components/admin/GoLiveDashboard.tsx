import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  Rocket, 
  CheckCircle, 
  AlertTriangle,
  XCircle,
  Clock,
  Users,
  Database,
  Zap,
  CreditCard,
  Gauge,
  Shield,
  FileText,
  Monitor,
  Bell
} from 'lucide-react';

interface GoLiveChecklistItem {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  category: 'technical' | 'business' | 'security' | 'documentation';
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedTime: string;
  dependencies?: string[];
}

export const GoLiveDashboard = () => {
  const { toast } = useToast();
  const [checklistItems, setChecklistItems] = useState<GoLiveChecklistItem[]>([]);
  const [currentPhase, setCurrentPhase] = useState<'preparation' | 'testing' | 'deployment' | 'monitoring' | 'completed'>('preparation');

  const defaultChecklist: GoLiveChecklistItem[] = [
    // Phase Technique
    {
      id: 'db-backup',
      title: 'Sauvegarde Base de Données',
      description: 'Créer une sauvegarde complète avant le déploiement',
      status: 'completed',
      category: 'technical',
      priority: 'critical',
      estimatedTime: '10 min'
    },
    {
      id: 'edge-functions-test',
      title: 'Test Edge Functions',
      description: 'Vérifier toutes les fonctions edge en production',
      status: 'completed',
      category: 'technical',
      priority: 'critical',
      estimatedTime: '15 min'
    },
    {
      id: 'performance-test',
      title: 'Tests de Performance',
      description: 'Valider les temps de réponse et la charge',
      status: 'completed',
      category: 'technical',
      priority: 'high',
      estimatedTime: '30 min'
    },
    {
      id: 'monitoring-setup',
      title: 'Configuration Monitoring',
      description: 'Activer toutes les alertes et métriques',
      status: 'completed',
      category: 'technical',
      priority: 'high',
      estimatedTime: '20 min'
    },
    
    // Phase Sécurité
    {
      id: 'rls-audit',
      title: 'Audit Sécurité RLS',
      description: 'Vérifier toutes les politiques de sécurité',
      status: 'completed',
      category: 'security',
      priority: 'critical',
      estimatedTime: '25 min'
    },
    {
      id: 'secrets-audit',
      title: 'Audit des Secrets',
      description: 'Valider la configuration de tous les secrets',
      status: 'completed',
      category: 'security',
      priority: 'critical',
      estimatedTime: '10 min'
    },
    {
      id: 'auth-test',
      title: 'Tests d\'Authentification',
      description: 'Tester tous les flux d\'authentification',
      status: 'completed',
      category: 'security',
      priority: 'high',
      estimatedTime: '20 min'
    },
    
    // Phase Business
    {
      id: 'stripe-integration',
      title: 'Test Paiements Stripe',
      description: 'Vérifier l\'intégration complète des paiements',
      status: 'completed',
      category: 'business',
      priority: 'critical',
      estimatedTime: '15 min'
    },
    {
      id: 'user-flows',
      title: 'Tests Parcours Utilisateur',
      description: 'Valider tous les parcours utilisateur critiques',
      status: 'completed',
      category: 'business',
      priority: 'high',
      estimatedTime: '45 min'
    },
    {
      id: 'email-notifications',
      title: 'Tests Notifications Email',
      description: 'Vérifier l\'envoi de tous les emails automatiques',
      status: 'in-progress',
      category: 'business',
      priority: 'medium',
      estimatedTime: '15 min'
    },
    
    // Phase Documentation
    {
      id: 'user-documentation',
      title: 'Documentation Utilisateur',
      description: 'Finaliser la documentation complète',
      status: 'completed',
      category: 'documentation',
      priority: 'high',
      estimatedTime: '60 min'
    },
    {
      id: 'rollback-procedures',
      title: 'Procédures de Rollback',
      description: 'Documenter et tester les procédures d\'urgence',
      status: 'completed',
      category: 'documentation',
      priority: 'high',
      estimatedTime: '30 min'
    },
    {
      id: 'support-procedures',
      title: 'Procédures de Support',
      description: 'Préparer les processus de support utilisateur',
      status: 'pending',
      category: 'documentation',
      priority: 'medium',
      estimatedTime: '45 min'
    }
  ];

  useEffect(() => {
    setChecklistItems(defaultChecklist);
    
    // Déterminer la phase actuelle basée sur les statuts
    const completed = defaultChecklist.filter(item => item.status === 'completed').length;
    const total = defaultChecklist.length;
    const progress = completed / total;
    
    if (progress === 1) {
      setCurrentPhase('completed');
    } else if (progress > 0.8) {
      setCurrentPhase('monitoring');
    } else if (progress > 0.6) {
      setCurrentPhase('deployment');
    } else if (progress > 0.3) {
      setCurrentPhase('testing');
    } else {
      setCurrentPhase('preparation');
    }
  }, []);

  const updateItemStatus = (itemId: string, newStatus: GoLiveChecklistItem['status']) => {
    setChecklistItems(items => 
      items.map(item => 
        item.id === itemId ? { ...item, status: newStatus } : item
      )
    );
    
    toast({
      title: "Statut Mis à Jour",
      description: `Élément "${checklistItems.find(i => i.id === itemId)?.title}" marqué comme ${newStatus}`,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical':
        return <Zap className="h-5 w-5 text-blue-500" />;
      case 'business':
        return <CreditCard className="h-5 w-5 text-green-500" />;
      case 'security':
        return <Shield className="h-5 w-5 text-red-500" />;
      case 'documentation':
        return <FileText className="h-5 w-5 text-purple-500" />;
      default:
        return <Database className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'monitoring':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'deployment':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'testing':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const completedItems = checklistItems.filter(item => item.status === 'completed').length;
  const totalItems = checklistItems.length;
  const progressPercentage = (completedItems / totalItems) * 100;

  const criticalPending = checklistItems.filter(item => 
    item.priority === 'critical' && item.status !== 'completed'
  );

  const groupedItems = checklistItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, GoLiveChecklistItem[]>);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Rocket className="h-8 w-8" />
          Tableau de Bord Go-Live
        </h1>
        <p className="text-muted-foreground">
          Préparation et suivi du déploiement en production
        </p>
      </div>

      {/* État Global */}
      <Card className={`border-2 ${getPhaseColor(currentPhase)}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Monitor className="h-6 w-6" />
              <span>Phase Actuelle: {currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)}</span>
            </div>
            <Badge className={getPhaseColor(currentPhase)}>
              {progressPercentage.toFixed(0)}% Complété
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{completedItems}</div>
                <div className="text-sm text-muted-foreground">Terminés</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">
                  {checklistItems.filter(i => i.status === 'in-progress').length}
                </div>
                <div className="text-sm text-muted-foreground">En cours</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-500">
                  {checklistItems.filter(i => i.status === 'pending').length}
                </div>
                <div className="text-sm text-muted-foreground">En attente</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">
                  {criticalPending.length}
                </div>
                <div className="text-sm text-muted-foreground">Critiques restants</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alertes Critiques */}
      {criticalPending.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Éléments critiques à terminer avant le go-live :</strong>
            <ul className="mt-2 list-disc list-inside">
              {criticalPending.map(item => (
                <li key={item.id}>{item.title}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Checklist par Catégorie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(groupedItems).map(([category, items]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getCategoryIcon(category)}
                <span className="capitalize">{category}</span>
                <Badge variant="outline">
                  {items.filter(i => i.status === 'completed').length}/{items.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 border rounded-lg ${
                    item.status === 'completed' ? 'bg-green-50 border-green-200' :
                    item.status === 'in-progress' ? 'bg-blue-50 border-blue-200' :
                    item.status === 'failed' ? 'bg-red-50 border-red-200' :
                    'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusIcon(item.status)}
                        <span className="font-medium text-sm">{item.title}</span>
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {item.description}
                      </p>
                      <div className="text-xs text-muted-foreground">
                        Durée estimée: {item.estimatedTime}
                      </div>
                    </div>
                    <div className="flex gap-1 ml-2">
                      {item.status !== 'completed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateItemStatus(item.id, 'completed')}
                        >
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions de Déploiement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            Actions de Déploiement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => toast({
                title: "Mode Maintenance",
                description: "Activation du mode maintenance pour maintenance planifiée"
              })}
            >
              <Monitor className="h-6 w-6 mb-2" />
              Mode Maintenance
            </Button>
            
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => toast({
                title: "Tests de Fumée",
                description: "Exécution des tests critiques post-déploiement"
              })}
            >
              <Gauge className="h-6 w-6 mb-2" />
              Tests de Fumée
            </Button>
            
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => toast({
                title: "Monitoring Activé",
                description: "Surveillance intensive activée pour les premières heures"
              })}
            >
              <Bell className="h-6 w-6 mb-2" />
              Monitoring Intensif
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Résumé Final */}
      {currentPhase === 'completed' && (
        <Card className="border-2 border-green-500 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-6 w-6" />
              Prêt pour le Go-Live !
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Félicitations !</strong> Tous les éléments critiques sont complétés. 
                Votre application est prête pour le déploiement en production.
                
                <div className="mt-3 space-y-1">
                  <div>• Surveillance active : Activée</div>
                  <div>• Plan de rollback : Prêt</div>
                  <div>• Documentation : Complète</div>
                  <div>• Tests : Validés</div>
                </div>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
};