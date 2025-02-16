
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
    let mounted = true;

    async function getInitialSession() {
      try {
        setLoading(true);
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (mounted) {
          if (initialSession) {
            console.log('Initial session found:', initialSession.user.email);
            setUser(initialSession.user);
            setSession(initialSession);
            
            if (initialSession.user.user_metadata.is_tenant_user) {
              await linkTenantProfile(initialSession.user);
            }
          } else {
            console.log('No initial session found');
            setUser(null);
            setSession(null);
          }
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log('Auth state changed:', event, currentSession?.user?.email);
      
      if (mounted) {
        if (currentSession) {
          console.log('Setting session:', currentSession.user.email);
          setUser(currentSession.user);
          setSession(currentSession);
          
          if (currentSession.user.user_metadata.is_tenant_user) {
            await linkTenantProfile(currentSession.user);
          }
        } else {
          console.log('Clearing session');
          setUser(null);
          setSession(null);
        }
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setUser, setSession, setLoading, linkTenantProfile]);

  console.log('AuthProvider state:', { 
    hasUser: !!user, 
    hasSession: !!session, 
    loading 
  });

  return (
    <AuthContext.Provider value={{ user, session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
