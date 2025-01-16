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

    const checkSession = async () => {
      try {
        setLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking session:', error);
          if (mounted) {
            setUser(null);
          }
          return;
        }

        if (session?.user && mounted) {
          console.log('AuthProvider: Valid session found for user:', session.user.email);
          await updateTenantProfile(session.user);
          setUser(session.user);
        } else {
          console.log('AuthProvider: No valid session found');
          if (mounted) {
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error in checkSession:', error);
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Initial session check
    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('AuthProvider: Auth state changed:', event, session?.user?.email ?? 'No user');
      
      if (!mounted) return;

      try {
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('AuthProvider: User signed in:', session.user.email);
          await updateTenantProfile(session.user);
          setUser(session.user);
        } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
          console.log('AuthProvider: User signed out or deleted');
          setUser(null);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          console.log('AuthProvider: Token refreshed for user:', session.user.email);
          setUser(session.user);
        } else if (event === 'USER_UPDATED' && session?.user) {
          console.log('AuthProvider: User updated:', session.user.email);
          setUser(session.user);
        }
      } catch (error) {
        console.error('Error in auth state change handler:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setUser, setLoading]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}