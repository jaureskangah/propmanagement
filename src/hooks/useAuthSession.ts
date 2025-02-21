
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export function useAuthSession() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupération immédiate de la session
    const getInitialSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log('Session initiale:', {
          hasSession: !!initialSession,
          userId: initialSession?.user?.id
        });
        
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
      } catch (error) {
        console.error('Erreur lors de la récupération de la session:', error);
      } finally {
        setLoading(false);
      }
    };

    // Appel immédiat pour récupérer la session
    getInitialSession();

    // Abonnement aux changements d'état d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, updatedSession) => {
      console.log('Changement d\'état d\'authentification:', {
        event: _event,
        hasSession: !!updatedSession,
        userId: updatedSession?.user?.id
      });

      setSession(updatedSession);
      setUser(updatedSession?.user ?? null);
      setLoading(false);
    });

    // Nettoyage
    return () => subscription.unsubscribe();
  }, []);

  console.log('useAuthSession état actuel:', {
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
