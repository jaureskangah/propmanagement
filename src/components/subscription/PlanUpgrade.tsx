import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Zap, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PlanUpgradeProps {
  feature: string;
  title?: string;
  description?: string;
}

const featureMessages = {
  advancedReports: {
    title: 'Rapports Avancés',
    description: 'Accédez à des rapports détaillés avec le plan Standard ou Pro.',
    icon: <Zap className="h-6 w-6 text-primary" />,
    requiredPlan: 'Standard'
  },
  exportData: {
    title: 'Export de Données',
    description: 'Exportez vos données en différents formats avec le plan Standard ou Pro.',
    icon: <Crown className="h-6 w-6 text-primary" />,
    requiredPlan: 'Standard'
  },
  automatedReminders: {
    title: 'Rappels Automatisés',
    description: 'Automatisez vos rappels de paiement avec le plan Standard ou Pro.',
    icon: <Zap className="h-6 w-6 text-primary" />,
    requiredPlan: 'Standard'
  },
  prioritySupport: {
    title: 'Support Prioritaire',
    description: 'Bénéficiez d\'un support prioritaire avec le plan Standard ou Pro.',
    icon: <Shield className="h-6 w-6 text-primary" />,
    requiredPlan: 'Standard'
  },
  advancedFinancialReports: {
    title: 'Rapports Financiers Avancés',
    description: 'Accédez à des analyses financières approfondies avec le plan Pro.',
    icon: <Crown className="h-6 w-6 text-primary" />,
    requiredPlan: 'Pro'
  },
  dedicatedSupport: {
    title: 'Support Dédié',
    description: 'Profitez d\'une équipe de support dédiée avec le plan Pro.',
    icon: <Shield className="h-6 w-6 text-primary" />,
    requiredPlan: 'Pro'
  }
};

export const PlanUpgrade = ({ feature, title, description }: PlanUpgradeProps) => {
  const navigate = useNavigate();
  const featureInfo = featureMessages[feature as keyof typeof featureMessages] || {
    title: title || 'Fonctionnalité Premium',
    description: description || 'Cette fonctionnalité nécessite un plan supérieur.',
    icon: <Crown className="h-6 w-6 text-primary" />,
    requiredPlan: 'Standard'
  };

  return (
    <Card className="border-primary/20">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          {featureInfo.icon}
        </div>
        <CardTitle className="text-lg">{featureInfo.title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-muted-foreground">
          {featureInfo.description}
        </p>
        <Button 
          onClick={() => navigate('/#pricing')}
          className="w-full"
        >
          Passer au plan {featureInfo.requiredPlan}
        </Button>
      </CardContent>
    </Card>
  );
};