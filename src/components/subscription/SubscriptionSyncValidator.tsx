import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { useSubscriptionLimits } from '@/hooks/useSubscriptionLimits';
import { 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  AlertTriangle,
  Database,
  Zap,
  Clock
} from 'lucide-react';

interface SubscriptionStatus {
  source: string;
  subscribed: boolean;
  subscription_tier: string;
  subscription_end: string | null;
  last_updated: string;
}

export const SubscriptionSyncValidator = () => {
  const { toast } = useToast();
  const { user, subscription, refreshSubscription } = useAuth();
  const limits = useSubscriptionLimits();
  const [isValidating, setIsValidating] = useState(false);
  const [syncResults, setSyncResults] = useState<{
    database: SubscriptionStatus | null;
    stripe: SubscriptionStatus | null;
    context: SubscriptionStatus | null;
    hooks: SubscriptionStatus | null;
  }>({
    database: null,
    stripe: null,
    context: null,
    hooks: null
  });

  const validateSync = async () => {
    if (!user?.email) return;
    
    setIsValidating(true);
    try {
      // 1. Vérifier les données dans la base de données
      const { data: dbData } = await supabase
        .from('subscribers')
        .select('*')
        .eq('email', user.email)
        .single();

      // 2. Vérifier les données via Stripe (edge function)
      const { data: stripeData } = await supabase.functions.invoke('check-subscription');

      // 3. Capturer l'état du contexte Auth
      const contextData = {
        subscribed: subscription.subscribed,
        subscription_tier: subscription.tier,
        subscription_end: subscription.subscription_end
      };

      // 4. Capturer l'état des hooks useSubscriptionLimits
      const hooksData = {
        subscribed: limits.tier !== 'free',
        subscription_tier: limits.tier,
        subscription_end: null // hook doesn't provide this
      };

      setSyncResults({
        database: dbData ? {
          source: 'Database',
          subscribed: dbData.subscribed,
          subscription_tier: dbData.subscription_tier || 'free',
          subscription_end: dbData.subscription_end,
          last_updated: dbData.updated_at
        } : null,
        stripe: stripeData ? {
          source: 'Stripe API',
          subscribed: stripeData.subscribed,
          subscription_tier: stripeData.subscription_tier || 'free',
          subscription_end: stripeData.subscription_end,
          last_updated: new Date().toISOString()
        } : null,
        context: {
          source: 'Auth Context', 
          subscribed: contextData.subscribed,
          subscription_tier: contextData.subscription_tier,
          subscription_end: contextData.subscription_end,
          last_updated: new Date().toISOString()
        },
        hooks: {
          source: 'useSubscriptionLimits',
          subscribed: hooksData.subscribed,
          subscription_tier: hooksData.subscription_tier,
          subscription_end: hooksData.subscription_end,
          last_updated: new Date().toISOString()
        }
      });

      toast({
        title: "Validation terminée",
        description: "Les statuts d'abonnement ont été vérifiés sur toutes les sources."
      });

    } catch (error) {
      console.error('Erreur lors de la validation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de valider la synchronisation.",
        variant: "destructive"
      });
    } finally {
      setIsValidating(false);
    }
  };

  const forceSync = async () => {
    setIsValidating(true);
    try {
      await refreshSubscription();
      await validateSync();
      toast({
        title: "Synchronisation forcée",
        description: "Les données ont été actualisées depuis Stripe."
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de forcer la synchronisation.",
        variant: "destructive"
      });
    } finally {
      setIsValidating(false);
    }
  };

  useEffect(() => {
    if (user) {
      validateSync();
    }
  }, [user]);

  const renderStatusCard = (status: SubscriptionStatus | null, icon: React.ReactNode) => {
    if (!status) {
      return (
        <Card className="opacity-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              {icon}
              Données non disponibles
            </CardTitle>
          </CardHeader>
        </Card>
      );
    }

    const isConsistent = syncResults.stripe && 
      status.subscribed === syncResults.stripe.subscribed &&
      status.subscription_tier === syncResults.stripe.subscription_tier;

    return (
      <Card className={isConsistent ? 'ring-1 ring-green-500' : 'ring-1 ring-yellow-500'}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            {icon}
            {status.source}
            {isConsistent ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Statut:</span>
            <Badge variant={status.subscribed ? "default" : "outline"}>
              {status.subscribed ? 'Actif' : 'Inactif'}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Plan:</span>
            <Badge variant="secondary">
              {status.subscription_tier === 'free' ? 'Gratuit' : 
               status.subscription_tier === 'standard' ? 'Standard' : 'Pro'}
            </Badge>
          </div>
          {status.subscription_end && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Fin:</span>
              <span className="text-xs">
                {new Date(status.subscription_end).toLocaleDateString()}
              </span>
            </div>
          )}
          <div className="text-xs text-muted-foreground">
            MAJ: {new Date(status.last_updated).toLocaleString()}
          </div>
        </CardContent>
      </Card>
    );
  };

  const allConsistent = syncResults.stripe && syncResults.database && syncResults.context &&
    syncResults.database.subscribed === syncResults.stripe.subscribed &&
    syncResults.context.subscribed === syncResults.stripe.subscribed &&
    syncResults.database.subscription_tier === syncResults.stripe.subscription_tier &&
    syncResults.context.subscription_tier === syncResults.stripe.subscription_tier;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Validation de la Synchronisation</h1>
        <p className="text-muted-foreground">
          Vérification de la cohérence des statuts d'abonnement entre toutes les sources
        </p>
      </div>

      {/* Status Global */}
      <Card className={allConsistent ? 'ring-2 ring-green-500' : 'ring-2 ring-yellow-500'}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {allConsistent ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            )}
            État de Synchronisation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Badge variant={allConsistent ? "default" : "destructive"} className="text-sm">
              {allConsistent ? 'Synchronisé' : 'Désynchronisé'}
            </Badge>
            <div className="flex gap-2">
              <Button 
                onClick={validateSync} 
                disabled={isValidating}
                variant="outline"
                size="sm"
              >
                {isValidating ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Revalider
              </Button>
              <Button 
                onClick={forceSync} 
                disabled={isValidating}
                size="sm"
              >
                {isValidating ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Zap className="h-4 w-4 mr-2" />
                )}
                Forcer la Sync
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sources de Données */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderStatusCard(
          syncResults.stripe,
          <Zap className="h-4 w-4 text-blue-500" />
        )}
        {renderStatusCard(
          syncResults.database,
          <Database className="h-4 w-4 text-purple-500" />
        )}
        {renderStatusCard(
          syncResults.context,
          <Clock className="h-4 w-4 text-orange-500" />
        )}
        {renderStatusCard(
          syncResults.hooks,
          <CheckCircle className="h-4 w-4 text-green-500" />
        )}
      </div>

      {/* Détails des Limites */}
      <Card>
        <CardHeader>
          <CardTitle>Limites Actuelles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Propriétés max</div>
              <div className="font-medium">
                {limits.maxProperties === Infinity ? '∞' : limits.maxProperties}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Locataires max</div>
              <div className="font-medium">
                {limits.maxTenants === Infinity ? '∞' : limits.maxTenants}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Rapports avancés</div>
              <div className="font-medium">
                {limits.canUseAdvancedReports ? '✓' : '✗'}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Support prioritaire</div>
              <div className="font-medium">
                {limits.hasPrioritySupport ? '✓' : '✗'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};