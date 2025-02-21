
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export function useAuthSession() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log('Initial session check:', { hasSession: !!initialSession });
        
        if (initialSession) {
          setSession(initialSession);
          setUser(initialSession.user);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // 2. Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('Auth state changed:', { 
        event,
        hasSession: !!newSession,
        userId: newSession?.user?.id 
      });

      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    // 3. Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  console.log('useAuthSession current state:', { 
    hasUser: !!user, 
    hasSession: !!session,
    loading,
    isAuthenticated: !!user && !!session
  });

  return { 
    user, 
    session, 
    loading,
    isAuthenticated: !!user && !!session
  };
}
