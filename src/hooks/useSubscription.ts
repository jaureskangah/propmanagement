import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

export interface SubscriptionInfo {
  subscribed: boolean;
  subscription_tier: 'free' | 'standard' | 'pro';
  subscription_end: string | null;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionInfo>({
    subscribed: false,
    subscription_tier: 'free',
    subscription_end: null,
  });
  const [loading, setLoading] = useState(true);

  const checkSubscription = async () => {
    if (!user) {
      setSubscription({
        subscribed: false,
        subscription_tier: 'free',
        subscription_end: null,
      });
      setLoading(false);
      return;
    }

    try {
      // Vérifier d'abord dans la base de données locale
      const { data: localSubscription } = await supabase
        .from('subscribers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (localSubscription) {
        setSubscription({
          subscribed: localSubscription.subscribed,
          subscription_tier: (localSubscription.subscription_tier || 'free') as 'free' | 'standard' | 'pro',
          subscription_end: localSubscription.subscription_end,
        });
      }

      // Vérifier avec Stripe pour être sûr
      const { data: stripeData } = await supabase.functions.invoke('check-subscription');
      
      if (stripeData) {
        setSubscription({
          subscribed: stripeData.subscribed,
          subscription_tier: (stripeData.subscription_tier || 'free') as 'free' | 'standard' | 'pro',
          subscription_end: stripeData.subscription_end,
        });
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSubscription();
  }, [user]);

  return {
    subscription,
    loading,
    refreshSubscription: checkSubscription,
  };
};