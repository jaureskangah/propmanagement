import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSubscriptionLimits } from '@/hooks/useSubscriptionLimits';
import { useAuth } from '@/components/AuthProvider';
import { 
  Crown, 
  Check, 
  Zap, 
  Star, 
  Settings, 
  ExternalLink,
  CreditCard,
  RefreshCw
} from 'lucide-react';

interface PlanFeature {
  name: string;
  standard: boolean;
  pro: boolean;
}

const features: PlanFeature[] = [
  { name: "Propriétés", standard: true, pro: true },
  { name: "Locataires illimités", standard: true, pro: true },
  { name: "Rapports avancés", standard: true, pro: true },
  { name: "Export de données", standard: true, pro: true },
  { name: "Rappels automatisés", standard: true, pro: true },
  { name: "Support prioritaire", standard: true, pro: true },
  { name: "Rapports financiers avancés", standard: false, pro: true },
  { name: "Support dédié", standard: false, pro: true },
];

export const SubscriptionManager = () => {
  const { toast } = useToast();
  const { subscription, refreshSubscription } = useAuth();
  const limits = useSubscriptionLimits();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: 'standard' | 'pro') => {
    try {
      setIsLoading(plan);
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan }
      });

      if (error) throw error;

      if (data?.url) {
        // Ouvrir Stripe checkout dans un nouvel onglet
        window.open(data.url, '_blank');
        
        toast({
          title: "Redirection vers Stripe",
          description: "Une nouvelle fenêtre s'est ouverte pour finaliser votre abonnement.",
        });
      }
    } catch (error) {
      console.error('Erreur lors de la création du checkout:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la session de paiement. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(null);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setIsLoading('portal');
      
      const { data, error } = await supabase.functions.invoke('customer-portal');

      if (error) throw error;

      if (data?.url) {
        // Ouvrir le portail client dans un nouvel onglet
        window.open(data.url, '_blank');
        
        toast({
          title: "Redirection vers le portail client",
          description: "Une nouvelle fenêtre s'est ouverte pour gérer votre abonnement.",
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'ouverture du portail:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible d'ouvrir le portail client.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(null);
    }
  };

  const handleRefreshSubscription = async () => {
    try {
      setIsLoading('refresh');
      await refreshSubscription();
      toast({
        title: "Statut mis à jour",
        description: "Le statut de votre abonnement a été actualisé.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(null);
    }
  };

  const currentPlan = limits.tier;
  const isSubscribed = subscription.subscribed;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Abonnements</h1>
        <p className="text-gray-600">Choisissez le plan qui correspond à vos besoins</p>
      </div>

      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Statut Actuel
            <Button
              variant="outline"
              size="sm"
              className="ml-auto"
              onClick={handleRefreshSubscription}
              disabled={isLoading === 'refresh'}
            >
              {isLoading === 'refresh' ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Actualiser
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Plan actuel</p>
              <Badge variant={isSubscribed ? "default" : "outline"} className="mt-1">
                {currentPlan === 'free' ? 'Gratuit' : 
                 currentPlan === 'standard' ? 'Standard' : 'Pro'}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">Propriétés max</p>
              <p className="font-medium">
                {limits.maxProperties === Infinity ? '∞' : limits.maxProperties}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Statut</p>
              <p className="font-medium">
                {isSubscribed ? 'Actif' : 'Inactif'}
              </p>
            </div>
          </div>
          
          {isSubscribed && (
            <div className="mt-4">
              <Button 
                onClick={handleManageSubscription}
                disabled={isLoading === 'portal'}
                className="flex items-center gap-2"
              >
                {isLoading === 'portal' ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Settings className="h-4 w-4" />
                )}
                Gérer l'abonnement
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Free Plan */}
        <Card className={currentPlan === 'free' ? 'ring-2 ring-primary' : ''}>
          <CardHeader>
            <CardTitle className="text-center">
              Plan Gratuit
              {currentPlan === 'free' && (
                <Badge className="ml-2">Actuel</Badge>
              )}
            </CardTitle>
            <div className="text-center">
              <span className="text-3xl font-bold">0€</span>
              <span className="text-gray-600">/mois</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">1 propriété</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">1 locataire</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Fonctionnalités de base</span>
              </li>
            </ul>
            <Button 
              variant="outline" 
              className="w-full" 
              disabled
            >
              Plan actuel
            </Button>
          </CardContent>
        </Card>

        {/* Standard Plan */}
        <Card className={currentPlan === 'standard' ? 'ring-2 ring-primary' : ''}>
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Zap className="h-5 w-5 text-blue-500" />
              Plan Standard
              {currentPlan === 'standard' && (
                <Badge className="ml-2">Actuel</Badge>
              )}
            </CardTitle>
            <div className="text-center">
              <span className="text-3xl font-bold">19€</span>
              <span className="text-gray-600">/mois</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">10 propriétés max</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Locataires illimités</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Rapports avancés</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Support prioritaire</span>
              </li>
            </ul>
            {currentPlan === 'standard' ? (
              <Button 
                onClick={handleManageSubscription}
                disabled={isLoading === 'portal'}
                className="w-full"
              >
                {isLoading === 'portal' ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CreditCard className="h-4 w-4 mr-2" />
                )}
                Gérer
              </Button>
            ) : (
              <Button 
                onClick={() => handleSubscribe('standard')}
                disabled={isLoading === 'standard'}
                className="w-full"
              >
                {isLoading === 'standard' ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CreditCard className="h-4 w-4 mr-2" />
                )}
                S'abonner
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Pro Plan */}
        <Card className={currentPlan === 'pro' ? 'ring-2 ring-primary' : 'ring-2 ring-yellow-400'}>
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Plan Pro
              {currentPlan === 'pro' && (
                <Badge className="ml-2">Actuel</Badge>
              )}
              <Badge variant="secondary" className="ml-2">Populaire</Badge>
            </CardTitle>
            <div className="text-center">
              <span className="text-3xl font-bold">49€</span>
              <span className="text-gray-600">/mois</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Propriétés illimitées</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Locataires illimités</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Tous les rapports</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Support dédié</span>
              </li>
            </ul>
            {currentPlan === 'pro' ? (
              <Button 
                onClick={handleManageSubscription}
                disabled={isLoading === 'portal'}
                className="w-full"
              >
                {isLoading === 'portal' ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CreditCard className="h-4 w-4 mr-2" />
                )}
                Gérer
              </Button>
            ) : (
              <Button 
                onClick={() => handleSubscribe('pro')}
                disabled={isLoading === 'pro'}
                className="w-full"
              >
                {isLoading === 'pro' ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CreditCard className="h-4 w-4 mr-2" />
                )}
                S'abonner
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Feature Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Comparaison des fonctionnalités</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Fonctionnalité</th>
                  <th className="text-center py-2">Standard</th>
                  <th className="text-center py-2">Pro</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{feature.name}</td>
                    <td className="text-center py-2">
                      {feature.standard ? (
                        <Check className="h-4 w-4 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="text-center py-2">
                      {feature.pro ? (
                        <Check className="h-4 w-4 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};