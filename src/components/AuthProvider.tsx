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

  const linkTenantProfile = async (user: User) => {
    try {
      console.log('Checking for existing tenant with email:', user.email);
      const { data: tenant, error: tenantError } = await supabase
        .from('tenants')
        .select('*')
        .eq('email', user.email)
        .maybeSingle();

      if (tenantError) {
        console.error('Error checking tenant:', tenantError);
        return;
      }

      if (tenant && !tenant.tenant_profile_id) {
        console.log('Found tenant without profile link, updating...', tenant.id);
        const { error: updateError } = await supabase
          .from('tenants')
          .update({ tenant_profile_id: user.id })
          .eq('id', tenant.id);

        if (updateError) {
          console.error('Error updating tenant:', updateError);
        } else {
          console.log('Successfully linked tenant profile');
        }
      }
    } catch (error) {
      console.error('Error in linkTenantProfile:', error);
    }
  };

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
            localStorage.removeItem('supabase.auth.token');
            await supabase.auth.signOut();
          }
          return;
        }

        if (session?.user && mounted) {
          console.log('AuthProvider: Valid session found for user:', session.user.email);
          await updateTenantProfile(session.user);
          
          // Ajout de la vérification et liaison automatique
          if (session.user.user_metadata.is_tenant_user) {
            await linkTenantProfile(session.user);
          }
          
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
          localStorage.removeItem('supabase.auth.token');
          await supabase.auth.signOut();
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('AuthProvider: Auth state changed:', event, session?.user?.email ?? 'No user');
      
      if (!mounted) return;

      try {
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('AuthProvider: User signed in:', session.user.email);
          await updateTenantProfile(session.user);
          
          // Ajout de la vérification et liaison automatique lors de la connexion
          if (session.user.user_metadata.is_tenant_user) {
            await linkTenantProfile(session.user);
          }
          
          setUser(session.user);
        } else if (event === 'SIGNED_OUT') {
          console.log('AuthProvider: User signed out');
          setUser(null);
          localStorage.removeItem('supabase.auth.token');
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
        localStorage.removeItem('supabase.auth.token');
        await supabase.auth.signOut();
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