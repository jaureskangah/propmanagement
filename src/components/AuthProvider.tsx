
import { createContext, useContext, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications';
import { useTenantProfileLink } from '@/hooks/useTenantProfileLink';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, setUser, loading, setLoading } = useAuthSession();
  const { linkTenantProfile } = useTenantProfileLink();
  useRealtimeNotifications();

  useEffect(() => {
    // Vérification immédiate de la session au chargement
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial auth check:', session?.user?.email ?? 'No session');
      if (session?.user) {
        setUser(session.user);
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    // Souscription aux changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (session?.user) {
        console.log('Setting user:', session.user);
        setUser(session.user);
        if (session.user.user_metadata.is_tenant_user) {
          linkTenantProfile(session.user);
        }
      } else {
        console.log('Clearing user');
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setLoading, linkTenantProfile]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
