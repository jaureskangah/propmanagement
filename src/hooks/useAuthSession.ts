
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export function useAuthSession() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
          if (mounted) setLoading(false);
          return;
        }

        console.log('Initial session check:', {
          hasSession: !!initialSession,
          userEmail: initialSession?.user?.email
        });

        if (mounted) {
          if (initialSession) {
            setSession(initialSession);
            setUser(initialSession.user);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Unexpected error during session check:', error);
        if (mounted) setLoading(false);
      }
    }

    console.log('Setting up auth listeners...');
    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', { 
          event, 
          userEmail: currentSession?.user?.email,
          userId: currentSession?.user?.id 
        });
        
        if (mounted) {
          if (currentSession) {
            setSession(currentSession);
            setUser(currentSession.user);
          } else {
            setSession(null);
            setUser(null);
          }
          setLoading(false);
        }
      }
    );

    return () => {
      console.log('Cleaning up auth listeners...');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const isAuthenticated = !!user && !!session;
  console.log('Auth state:', { 
    isAuthenticated, 
    hasUser: !!user, 
    hasSession: !!session, 
    loading 
  });

  return { 
    user,
    session,
    loading,
    isAuthenticated
  };
}
