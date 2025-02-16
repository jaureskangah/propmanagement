
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
  const { user, setUser, session, setSession, loading, setLoading, initializeAuthState } = useAuthSession();
  const { linkTenantProfile } = useTenantProfileLink();
  useRealtimeNotifications();

  useEffect(() => {
    // Initialize auth state when component mounts
    initializeAuthState();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log('Auth state changed:', event, 'User:', currentSession?.user?.email);

      if (event === 'SIGNED_IN') {
        if (currentSession) {
          console.log('User signed in:', currentSession.user.email);
          setUser(currentSession.user);
          setSession(currentSession);
          setLoading(false);

          if (currentSession.user.user_metadata.is_tenant_user) {
            await linkTenantProfile(currentSession.user);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        setUser(null);
        setSession(null);
        setLoading(false);
      }
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setSession, setLoading, linkTenantProfile, initializeAuthState]);

  console.log('AuthProvider render:', {
    isAuthenticated: !!session,
    userEmail: user?.email,
    loading,
  });

  return (
    <AuthContext.Provider value={{ user, session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
