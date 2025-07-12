import { useCallback, useEffect, useMemo, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useTenantCache } from '@/stores/tenantCache';

interface UseAutoRefreshOptions {
  interval?: number; // in milliseconds
  enabled?: boolean;
}

export const useAutoRefresh = (
  refreshFunction: () => Promise<void> | void,
  options: UseAutoRefreshOptions = {}
) => {
  const { interval = 30000, enabled = true } = options; // 30s default
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { isDataFresh } = useTenantCache();

  const startAutoRefresh = useCallback(() => {
    if (!enabled) return;

    intervalRef.current = setInterval(() => {
      // Only refresh if data is not fresh
      if (!isDataFresh()) {
        console.log('🔄 Auto-refreshing data...');
        refreshFunction();
      }
    }, interval);
  }, [refreshFunction, interval, enabled, isDataFresh]);

  const stopAutoRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoRefresh();
    return stopAutoRefresh;
  }, [startAutoRefresh, stopAutoRefresh]);

  return { startAutoRefresh, stopAutoRefresh };
};

// Real-time subscription manager
export const useRealtimeSubscription = (
  table: string,
  filter: string,
  callback: (payload: any) => void,
  enabled: boolean = true
) => {
  const channelRef = useRef<any>(null);

  const subscribeToChanges = useCallback(() => {
    if (!enabled) return;

    console.log(`🔴 Setting up realtime for ${table}`);
    
    channelRef.current = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
          filter: filter
        },
        callback
      )
      .subscribe();
  }, [table, filter, callback, enabled]);

  const unsubscribe = useCallback(() => {
    if (channelRef.current) {
      console.log(`🔴 Cleaning up realtime for ${table}`);
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
  }, [table]);

  useEffect(() => {
    subscribeToChanges();
    return unsubscribe;
  }, [subscribeToChanges, unsubscribe]);

  return { unsubscribe };
};