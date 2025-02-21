
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export function useAuthSession() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer la session initiale
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      console.log('Session initiale chargée:', {
        hasSession: !!initialSession,
        userId: initialSession?.user?.id
      });
      
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      setLoading(false);
    });

    // S'abonner aux changements d'état d'authentification
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

  return {
    user,
    session,
    loading,
    isAuthenticated: !!user && !!session
  };
}
