import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useSubscriptionLimits } from './useSubscriptionLimits';
import { supabase } from '@/integrations/supabase/client';

export interface AIUsageData {
  canSendMessage: boolean;
  remainingMessages: number;
  totalMessages: number;
  usedToday: number;
  isLoading: boolean;
  refreshUsage: () => Promise<void>;
}

export const useAIUsageLimits = (): AIUsageData => {
  const { user } = useAuth();
  const { maxAIMessages, isLoading: limitsLoading } = useSubscriptionLimits();
  const [usedToday, setUsedToday] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const checkTodayUsage = async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('ai_usage_daily')
        .select('message_count')
        .eq('user_id', user.id)
        .eq('usage_date', today)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking AI usage:', error);
        return;
      }

      setUsedToday(data?.message_count || 0);
    } catch (error) {
      console.error('Error checking AI usage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const incrementUsage = async () => {
    if (!user?.id) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('ai_usage_daily')
        .upsert({
          user_id: user.id,
          usage_date: today,
          message_count: usedToday + 1,
        }, {
          onConflict: 'user_id,usage_date'
        });

      if (error) {
        console.error('Error incrementing AI usage:', error);
        return;
      }

      setUsedToday(prev => prev + 1);
    } catch (error) {
      console.error('Error incrementing AI usage:', error);
    }
  };

  useEffect(() => {
    checkTodayUsage();
  }, [user?.id]);

  const canSendMessage = maxAIMessages === Infinity || usedToday < maxAIMessages;
  const remainingMessages = maxAIMessages === Infinity ? Infinity : Math.max(0, maxAIMessages - usedToday);

  return {
    canSendMessage,
    remainingMessages,
    totalMessages: maxAIMessages,
    usedToday,
    isLoading: isLoading || limitsLoading,
    refreshUsage: checkTodayUsage,
  };
};

// Export a function to increment usage (to be called after sending a message)
export const incrementAIUsage = async (userId: string) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data: existingUsage } = await supabase
      .from('ai_usage_daily')
      .select('message_count')
      .eq('user_id', userId)
      .eq('usage_date', today)
      .maybeSingle();

    const currentCount = existingUsage?.message_count || 0;
    
    const { error } = await supabase
      .from('ai_usage_daily')
      .upsert({
        user_id: userId,
        usage_date: today,
        message_count: currentCount + 1,
      }, {
        onConflict: 'user_id,usage_date'
      });

    if (error) {
      console.error('Error incrementing AI usage:', error);
    }
  } catch (error) {
    console.error('Error incrementing AI usage:', error);
  }
};