
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export function useAuthSession() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fonction pour mettre à jour l'état avec une session
    const updateSessionState = (currentSession: Session | null) => {
      console.log('Updating session state:', {
        hasSession: !!currentSession,
        userId: currentSession?.user?.id
      });
      
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    };

    // Vérifier la session immédiatement au chargement
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session loaded:', { 
        hasSession: !!session,
        userId: session?.user?.id
      });
      updateSessionState(session);
    });

    // S'abonner aux changements d'état d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed event:', {
        event: _event,
        hasSession: !!session,
        userId: session?.user?.id
      });
      updateSessionState(session);
    });

    // Nettoyage de l'abonnement
    return () => subscription.unsubscribe();
  }, []);

  return {
    user,
    session,
    loading,
    isAuthenticated: !!user && !!session
  };
}
