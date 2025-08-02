import { ReactNode } from 'react';
import { useSubscriptionLimits } from '@/hooks/useSubscriptionLimits';
import { PlanUpgrade } from './PlanUpgrade';

interface FeatureGateProps {
  feature: 'advancedReports' | 'exportData' | 'automatedReminders' | 'prioritySupport' | 'advancedFinancialReports' | 'dedicatedSupport';
  children: ReactNode;
  fallback?: ReactNode;
  showUpgrade?: boolean;
}

const featureMap = {
  advancedReports: 'canUseAdvancedReports',
  exportData: 'canExportData', 
  automatedReminders: 'canUseAutomatedReminders',
  prioritySupport: 'hasPrioritySupport',
  advancedFinancialReports: 'hasAdvancedFinancialReports',
  dedicatedSupport: 'hasDedicatedSupport',
} as const;

export const FeatureGate = ({ 
  feature, 
  children, 
  fallback,
  showUpgrade = true 
}: FeatureGateProps) => {
  const limits = useSubscriptionLimits();
  const hasAccess = limits[featureMap[feature]];

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (showUpgrade) {
    return <PlanUpgrade feature={feature} />;
  }

  return null;
};