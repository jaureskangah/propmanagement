import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Zap, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocale } from '@/components/providers/LocaleProvider';
import { planUpgradeTranslations } from '@/translations/features/planUpgrade';

interface PlanUpgradeProps {
  feature: string;
  title?: string;
  description?: string;
}

const getFeatureMessages = (t: any) => ({
  advancedReports: {
    title: t.advancedReports,
    description: t.advancedReportsDesc,
    icon: <Zap className="h-6 w-6 text-primary" />,
    requiredPlan: 'Standard'
  },
  exportData: {
    title: t.exportData,
    description: t.exportDataDesc,
    icon: <Crown className="h-6 w-6 text-primary" />,
    requiredPlan: 'Standard'
  },
  automatedReminders: {
    title: t.automatedReminders,
    description: t.automatedRemindersDesc,
    icon: <Zap className="h-6 w-6 text-primary" />,
    requiredPlan: 'Standard'
  },
  prioritySupport: {
    title: t.prioritySupport,
    description: t.prioritySupportDesc,
    icon: <Shield className="h-6 w-6 text-primary" />,
    requiredPlan: 'Standard'
  },
  advancedFinancialReports: {
    title: t.advancedFinancialReports,
    description: t.advancedFinancialReportsDesc,
    icon: <Crown className="h-6 w-6 text-primary" />,
    requiredPlan: 'Pro'
  },
  dedicatedSupport: {
    title: t.dedicatedSupport,
    description: t.dedicatedSupportDesc,
    icon: <Shield className="h-6 w-6 text-primary" />,
    requiredPlan: 'Pro'
  }
});

export const PlanUpgrade = ({ feature, title, description }: PlanUpgradeProps) => {
  const navigate = useNavigate();
  const { language } = useLocale();
  const t = planUpgradeTranslations[language] || planUpgradeTranslations.en;
  const featureMessages = getFeatureMessages(t);
  
  const featureInfo = featureMessages[feature as keyof typeof featureMessages] || {
    title: title || t.premiumFeature,
    description: description || t.requiresUpgrade,
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
          {featureInfo.requiredPlan === 'Pro' ? t.upgradeToPro : t.upgradeToStandard}
        </Button>
      </CardContent>
    </Card>
  );
};