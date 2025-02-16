
import { useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export function useAuthSession() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  const initializeAuthState = useCallback(async () => {
    try {
      console.log('Initializing auth state...');
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        throw error;
      }

      if (currentSession) {
        console.log('Found existing session for user:', currentSession.user.email);
        setUser(currentSession.user);
        setSession(currentSession);
      } else {
        console.log('No existing session found');
        setUser(null);
        setSession(null);
      }
    } catch (error) {
      console.error('Error initializing auth state:', error);
      setUser(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    setUser,
    session,
    setSession,
    loading,
    setLoading,
    initializeAuthState
  };
}
