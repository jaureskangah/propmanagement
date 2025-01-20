import { createContext, useContext, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useAuthSession } from '@/hooks/useAuthSession';
import { updateTenantProfile } from '@/hooks/useProfileUpdate';
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
    let mounted = true;

    const handleSession = async (session: any) => {
      if (!mounted) return;

      try {
        if (session?.user) {
          console.log('AuthProvider: Valid session found for user:', session.user.email);
          await updateTenantProfile(session.user);
          
          if (session.user.user_metadata.is_tenant_user) {
            await linkTenantProfile(session.user);
          }
          
          setUser(session.user);
        } else {
          console.log('AuthProvider: No valid session found');
          setUser(null);
        }
      } catch (error) {
        console.error('Error handling session:', error);
        setUser(null);
        localStorage.removeItem('supabase.auth.token');
        await supabase.auth.signOut();
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('AuthProvider: Auth state changed:', event, session?.user?.email ?? 'No user');
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        await handleSession(session);
      } else if (event === 'SIGNED_OUT') {
        console.log('AuthProvider: User signed out');
        setUser(null);
        localStorage.removeItem('supabase.auth.token');
      }
      
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setUser, setLoading, linkTenantProfile]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}