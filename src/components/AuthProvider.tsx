
import { createContext, useContext, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications';
import { useTenantProfileLink } from '@/hooks/useTenantProfileLink';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, session: null, loading: true });

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, setUser, session, setSession, loading, setLoading } = useAuthSession();
  const { linkTenantProfile } = useTenantProfileLink();
  useRealtimeNotifications();

  useEffect(() => {
    // Vérification immédiate de la session au chargement
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('Initial auth check:', currentSession?.user?.email ?? 'No session');
      if (currentSession?.user) {
        setUser(currentSession.user);
        setSession(currentSession);
        setLoading(false);
      } else {
        setUser(null);
        setSession(null);
        setLoading(false);
      }
    });

    // Souscription aux changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log('Auth state changed:', event, currentSession?.user?.email);
      
      if (currentSession?.user) {
        console.log('Setting user:', currentSession.user);
        setUser(currentSession.user);
        setSession(currentSession);
        if (currentSession.user.user_metadata.is_tenant_user) {
          linkTenantProfile(currentSession.user);
        }
      } else {
        console.log('Clearing user');
        setUser(null);
        setSession(null);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setSession, setLoading, linkTenantProfile]);

  return (
    <AuthContext.Provider value={{ user, session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
