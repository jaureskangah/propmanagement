import { useSubscription } from './useSubscription';
import { useAdminRole } from './useAdminRole';

export interface SubscriptionLimits {
  maxProperties: number;
  maxTenants: number;
  canUseAdvancedReports: boolean;
  canExportData: boolean;
  canUseAutomatedReminders: boolean;
  hasPrioritySupport: boolean;
  hasAdvancedFinancialReports: boolean;
  hasDedicatedSupport: boolean;
}

export const useSubscriptionLimits = (): SubscriptionLimits & { 
  tier: string;
  isLoading: boolean;
} => {
  const { subscription, loading } = useSubscription();
  const { isAdmin, loading: adminLoading } = useAdminRole();

  const getLimitsForTier = (tier: string): SubscriptionLimits => {
    switch (tier) {
      case 'standard':
        return {
          maxProperties: 10,
          maxTenants: Infinity,
          canUseAdvancedReports: true,
          canExportData: true,
          canUseAutomatedReminders: true,
          hasPrioritySupport: true,
          hasAdvancedFinancialReports: false,
          hasDedicatedSupport: false,
        };
      case 'pro':
        return {
          maxProperties: Infinity,
          maxTenants: Infinity,
          canUseAdvancedReports: true,
          canExportData: true,
          canUseAutomatedReminders: true,
          hasPrioritySupport: true,
          hasAdvancedFinancialReports: true,
          hasDedicatedSupport: true,
        };
      default: // 'free'
        return {
          maxProperties: 1,
          maxTenants: 1,
          canUseAdvancedReports: false,
          canExportData: false,
          canUseAutomatedReminders: false,
          hasPrioritySupport: false,
          hasAdvancedFinancialReports: false,
          hasDedicatedSupport: false,
        };
    }
  };

  // Admin users get unlimited access to everything
  const adminLimits: SubscriptionLimits = {
    maxProperties: Infinity,
    maxTenants: Infinity,
    canUseAdvancedReports: true,
    canExportData: true,
    canUseAutomatedReminders: true,
    hasPrioritySupport: true,
    hasAdvancedFinancialReports: true,
    hasDedicatedSupport: true,
  };

  const limits = isAdmin ? adminLimits : getLimitsForTier(subscription.subscription_tier);

  return {
    ...limits,
    tier: isAdmin ? 'admin' : subscription.subscription_tier,
    isLoading: loading || adminLoading,
  };
};