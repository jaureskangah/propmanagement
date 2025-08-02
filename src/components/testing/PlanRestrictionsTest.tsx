import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FeatureGate } from '@/components/subscription/FeatureGate';
import { LimitChecker } from '@/components/subscription/LimitChecker';
import { useSubscriptionLimits } from '@/hooks/useSubscriptionLimits';
import { useAuth } from '@/components/AuthProvider';
import { AlertTriangle, Check, X, Crown } from 'lucide-react';

export const PlanRestrictionsTest = () => {
  const limits = useSubscriptionLimits();
  const { isTenant } = useAuth();
  const [testPropertyCount, setTestPropertyCount] = useState(1);
  const [testTenantCount, setTestTenantCount] = useState(1);

  const testFeatures = [
    'advancedReports',
    'exportData', 
    'automatedReminders',
    'prioritySupport',
    'advancedFinancialReports',
    'dedicatedSupport'
  ] as const;

  const getStatusIcon = (hasAccess: boolean) => 
    hasAccess ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />;

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Test des Restrictions de Plan
            <Badge variant="outline" className="ml-auto">
              {isTenant ? 'Compte Locataire' : 'Compte Propriétaire'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Plan Status */}
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Plan Actuel</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>Tier: <Badge variant="outline">{limits.tier}</Badge></div>
              <div>Loading: {limits.isLoading ? 'Oui' : 'Non'}</div>
              <div>Max Propriétés: {limits.maxProperties === Infinity ? '∞' : limits.maxProperties}</div>
              <div>Max Locataires: {limits.maxTenants === Infinity ? '∞' : limits.maxTenants}</div>
            </div>
          </div>

          {/* Feature Tests */}
          <div>
            <h3 className="font-semibold mb-3">Tests des Fonctionnalités</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testFeatures.map((feature) => (
                <Card key={feature} className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{feature}</span>
                    {getStatusIcon(limits[`can${feature.charAt(0).toUpperCase() + feature.slice(1)}` as keyof typeof limits] as boolean || 
                                   limits[`has${feature.charAt(0).toUpperCase() + feature.slice(1)}` as keyof typeof limits] as boolean)}
                  </div>
                  <FeatureGate feature={feature} showUpgrade={false}>
                    <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                      ✓ Accès autorisé
                    </div>
                  </FeatureGate>
                </Card>
              ))}
            </div>
          </div>

          {/* Limit Tests */}
          <div>
            <h3 className="font-semibold mb-3">Tests des Limites</h3>
            <div className="space-y-4">
              {/* Property Limits */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium">Test Limite Propriétés:</span>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setTestPropertyCount(prev => prev + 1)}
                  >
                    Simuler +1 ({testPropertyCount})
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setTestPropertyCount(Math.max(0, testPropertyCount - 1))}
                  >
                    -1
                  </Button>
                </div>
                <LimitChecker 
                  type="properties" 
                  currentCount={testPropertyCount}
                  onLimitReached={() => console.log('Limite propriétés atteinte!')}
                >
                  <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                    Limite OK: {testPropertyCount}/{limits.maxProperties === Infinity ? '∞' : limits.maxProperties}
                  </div>
                </LimitChecker>
              </div>

              {/* Tenant Limits */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium">Test Limite Locataires:</span>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setTestTenantCount(prev => prev + 1)}
                  >
                    Simuler +1 ({testTenantCount})
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setTestTenantCount(Math.max(0, testTenantCount - 1))}
                  >
                    -1
                  </Button>
                </div>
                <LimitChecker 
                  type="tenants" 
                  currentCount={testTenantCount}
                  onLimitReached={() => console.log('Limite locataires atteinte!')}
                >
                  <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                    Limite OK: {testTenantCount}/{limits.maxTenants === Infinity ? '∞' : limits.maxTenants}
                  </div>
                </LimitChecker>
              </div>
            </div>
          </div>

          {/* Quick Limit Test */}
          <div className="flex gap-2">
            <Button 
              variant="destructive"
              size="sm"
              onClick={() => {
                setTestPropertyCount(10);
                setTestTenantCount(10);
              }}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Tester Limites Dépassées
            </Button>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => {
                setTestPropertyCount(1);
                setTestTenantCount(1);
              }}
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};