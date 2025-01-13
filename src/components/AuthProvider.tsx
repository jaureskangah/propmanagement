import { createContext, useContext, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useAuthSession } from '@/hooks/useAuthSession';
import { updateTenantProfile } from '@/hooks/useProfileUpdate';
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications';

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
  useRealtimeNotifications();

  useEffect(() => {
    let mounted = true;

    // Initial session check
    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          return;
        }

        if (session?.user && mounted) {
          console.log('AuthProvider: Valid session found:', session.user.email);
          await updateTenantProfile(session.user);
          setUser(session.user);
        } else {
          console.log('AuthProvider: No valid session found');
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('AuthProvider: Auth state changed:', event, session?.user?.email ?? 'No user');
      
      if (!mounted) return;

      try {
        if (event === 'SIGNED_IN' && session?.user) {
          await updateTenantProfile(session.user);
          setUser(session.user);
        } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
          setUser(null);
          console.log('AuthProvider: User signed out or deleted');
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          console.log('AuthProvider: Token refreshed for user:', session.user.email);
          setUser(session.user);
        }
      } catch (error) {
        console.error('Error in auth state change handler:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    });

    // Cleanup function
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setUser, setLoading]);

  console.log('AuthProvider: Current user state:', user?.email ?? 'No user');

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}