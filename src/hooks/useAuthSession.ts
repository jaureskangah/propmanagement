
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export function useAuthSession() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const getInitialSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (mounted) {
          console.log('Session initiale récupérée:', {
            hasSession: !!initialSession,
            userId: initialSession?.user?.id
          });
          
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          setLoading(false); // Important: on met loading à false après avoir mis à jour la session
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de la session:', error);
        if (mounted) {
          setLoading(false); // Important: on met aussi loading à false en cas d'erreur
        }
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, updatedSession) => {
      console.log('Changement d\'état d\'authentification:', {
        event: _event,
        hasSession: !!updatedSession,
        userId: updatedSession?.user?.id
      });

      if (mounted) {
        setSession(updatedSession);
        setUser(updatedSession?.user ?? null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    session,
    loading,
    isAuthenticated: !!session?.user
  };
}
