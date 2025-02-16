
import { useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export function useAuthSession() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Reset auth state
  const resetAuthState = useCallback(() => {
    setUser(null);
    setSession(null);
    setLoading(false);
  }, []);

  // Set auth state
  const setAuthState = useCallback((newSession: Session | null) => {
    if (newSession?.user) {
      setUser(newSession.user);
      setSession(newSession);
    } else {
      resetAuthState();
    }
    setLoading(false);
  }, [resetAuthState]);

  // Initialize auth state
  const initializeAuthState = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setAuthState(session);
    } catch (error) {
      console.error('Error initializing auth state:', error);
      resetAuthState();
    }
  }, [setAuthState, resetAuthState]);

  return {
    user,
    setUser,
    session,
    setSession,
    loading,
    setLoading,
    resetAuthState,
    setAuthState,
    initializeAuthState
  };
}
