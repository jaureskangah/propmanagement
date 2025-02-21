
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export function useAuthSession() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialisation immédiate de la session
    const getInitialSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log('Session initiale :', {
          hasSession: !!initialSession,
          userId: initialSession?.user?.id
        });
        
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
      } catch (error) {
        console.error('Erreur lors de la récupération de la session:', error);
      } finally {
        // Désactiver le chargement une fois que nous avons la session initiale
        setLoading(false);
      }
    };

    getInitialSession();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, updatedSession) => {
      console.log('Changement d\'état d\'authentification:', {
        event: _event,
        hasSession: !!updatedSession,
        userId: updatedSession?.user?.id
      });

      setSession(updatedSession);
      setUser(updatedSession?.user ?? null);
      // Ne pas modifier loading ici car il est déjà géré par getInitialSession
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const isAuthenticated = !!session?.user;

  return {
    user,
    session,
    loading,
    isAuthenticated
  };
}
