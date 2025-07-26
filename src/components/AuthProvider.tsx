
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  loading: boolean;
  isTenant: boolean;
  tenantData: any | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  isTenant: false,
  tenantData: null,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTenant, setIsTenant] = useState(false);
  const [tenantData, setTenantData] = useState<any | null>(null);
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;

        console.log("=== AUTH STATE CHANGE ===");
        console.log("Event:", event);
        console.log("User:", session?.user?.email);
        
        if (session?.user) {
          setUser(session.user);
          if (event === 'SIGNED_IN') {
            setTimeout(() => {
              if (isMounted) {
                checkTenantStatusWithRecovery(session.user.id);
              }
            }, 500);
          }
        } else {
          console.log("No session, clearing user data");
          setUser(null);
          setIsTenant(false);
          setTenantData(null);
          setLoading(false);
        }
      }
    );

    getInitialSession();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const checkTenantStatus = async (userId: string) => {
    try {
      console.log("🔍 Checking tenant status for:", userId);

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
        console.log("🚨 Deleted tenant account detected, forcing signout");
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
      console.log("=== CHECKING TENANT STATUS WITH RECOVERY ===");
      
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
      console.log("Signing out...");
      setLoading(true);
      
      // Clear state first
      setUser(null);
      setIsTenant(false);
      setTenantData(null);
      
      // Then sign out from Supabase
      await supabase.auth.signOut();
      
      console.log("Sign out successful");
      
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
      signIn, 
      signUp, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
