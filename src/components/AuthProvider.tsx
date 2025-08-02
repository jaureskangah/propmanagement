import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { logger } from '@/utils/logger';

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  loading: boolean;
  isTenant: boolean;
  tenantData: any | null;
  subscription: {
    tier: 'free' | 'standard' | 'pro';
    subscribed: boolean;
    subscription_end: string | null;
  };
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  isTenant: false,
  tenantData: null,
  subscription: {
    tier: 'free',
    subscribed: false,
    subscription_end: null,
  },
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  refreshSubscription: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTenant, setIsTenant] = useState(false);
  const [tenantData, setTenantData] = useState<any | null>(null);
  const [subscription, setSubscription] = useState({
    tier: 'free' as 'free' | 'standard' | 'pro',
    subscribed: false,
    subscription_end: null as string | null,
  });
  const isAuthenticated = !!user;

  useEffect(() => {
    let isMounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (isMounted) {
          if (session?.user) {
            setUser(session.user);
            await checkTenantStatus(session.user.id);
            await checkSubscriptionStatus();
          } else {
            setUser(null);
            setIsTenant(false);
            setTenantData(null);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Error getting initial session:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Listen for auth state changes
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;

        logger.auth("Auth state change", { event, email: session?.user?.email });
        
        if (session?.user) {
          setUser(session.user);
          if (event === 'SIGNED_IN') {
            setTimeout(() => {
              if (isMounted) {
                checkTenantStatusWithRecovery(session.user.id);
                checkSubscriptionStatus();
              }
            }, 500);
          }
        } else {
          logger.auth("No session, clearing user data");
          setUser(null);
          setIsTenant(false);
          setTenantData(null);
          setSubscription({
            tier: 'free',
            subscribed: false,
            subscription_end: null,
          });
          setLoading(false);
        }
      }
    );

    getInitialSession();

    return () => {
      isMounted = false;
      authSubscription.unsubscribe();
    };
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      const { data } = await supabase.functions.invoke('check-subscription');
      if (data) {
        setSubscription({
          tier: (data.subscription_tier || 'free') as 'free' | 'standard' | 'pro',
          subscribed: data.subscribed || false,
          subscription_end: data.subscription_end,
        });
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const refreshSubscription = async () => {
    await checkSubscriptionStatus();
  };

  const checkTenantStatus = async (userId: string) => {
    try {
      logger.tenant("Checking tenant status for:", userId);

      // Une seule requête pour vérifier tenant + profile
      const [tenantResult, profileResult] = await Promise.all([
        supabase
          .from('tenants')
          .select('id, name, email, unit_number, lease_start, lease_end, rent_amount, property_id, properties:property_id(name)')
          .eq('tenant_profile_id', userId)
          .maybeSingle(),
        supabase
          .from('profiles')
          .select('is_tenant_user')
          .eq('id', userId)
          .maybeSingle()
      ]);

      const { data: tenantData } = tenantResult;
      const { data: profileData } = profileResult;

      // Vérifier si l'utilisateur a un rôle admin pour éviter de bloquer les comptes admin
      const { data: adminRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();
      
      const hasAdminRole = !!adminRole;

      // Si marqué comme tenant mais pas de record tenant ET pas admin → compte supprimé
      if (profileData?.is_tenant_user && !tenantData && !hasAdminRole) {
        logger.warn("Deleted tenant account detected, forcing signout");
        alert("Votre compte locataire a été supprimé. Veuillez demander une nouvelle invitation à votre propriétaire.");
        await supabase.auth.signOut();
        window.location.href = '/auth';
        return;
      }

      // Sinon, définir le statut normalement
      setIsTenant(!!tenantData);
      setTenantData(tenantData);

    } catch (err) {
      console.error("❌ Error checking tenant status:", err);
      setIsTenant(false);
      setTenantData(null);
    } finally {
      setLoading(false);
    }
  };

  // Nouvelle fonction avec récupération automatique pour les nouveaux comptes
  const checkTenantStatusWithRecovery = async (userId: string) => {
    try {
      logger.tenant("Checking tenant status with recovery");
      
      // Pour la récupération, utilisons directement checkTenantStatus sans la boucle des appels répétés
      await checkTenantStatus(userId);
      
    } catch (error) {
      console.error("❌ Error in checkTenantStatusWithRecovery:", error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }
      
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      logger.auth("Signing out...");
      setLoading(true);
      
      // Clear state first
      setUser(null);
      setIsTenant(false);
      setTenantData(null);
      setSubscription({
        tier: 'free',
        subscribed: false,
        subscription_end: null,
      });
      
      // Clear all local storage keys related to auth
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      // Then sign out from Supabase with global scope
      await supabase.auth.signOut({ scope: 'global' });
      
      logger.auth("Sign out successful");
      
      // Force redirect to auth page
      window.location.href = '/auth';
    } catch (error) {
      console.error("Error signing out:", error);
      // Force redirect even if there's an error
      window.location.href = '/auth';
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      loading, 
      isTenant, 
      tenantData, 
      subscription,
      signIn, 
      signUp, 
      signOut,
      refreshSubscription 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};