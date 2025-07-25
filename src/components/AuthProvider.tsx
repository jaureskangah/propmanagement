
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
      const { data: hasAdminRole } = await supabase
        .rpc('has_role', { role: 'admin' })
        .single();

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
      
      // Première tentative
      await checkTenantStatus(userId);
      
      // Si toujours pas de données tenant mais marqué comme tenant, tenter une récupération
      const { data: profileData } = await supabase
        .from('profiles')
        .select('email, is_tenant_user')
        .eq('id', userId)
        .single();
        
      if (profileData?.is_tenant_user && !isTenant) {
        console.log("🔄 Attempting tenant profile recovery for recently created account..."); 
        
        // Chercher un tenant avec cet email qui n'est pas encore lié
        const { data: unlinkedTenant } = await supabase
          .from('tenants')
          .select('id, name, email')
          .eq('email', profileData.email)
          .is('tenant_profile_id', null)
          .maybeSingle();
          
        if (unlinkedTenant) {
          console.log("🔗 Found unlinked tenant, attempting automatic linking...");
          
          // Utiliser la fonction RPC pour lier automatiquement
          const { data: linkResult, error: linkError } = await supabase
            .rpc('link_tenant_profile', {
              p_tenant_id: unlinkedTenant.id,
              p_user_id: userId
            });
            
          if (!linkError && linkResult?.success) {
            console.log("✅ Automatic linking successful, rechecking status...");
            
            // Refaire une vérification après 500ms
            setTimeout(() => {
              checkTenantStatus(userId);
            }, 500);
          } else {
            console.error("❌ Automatic linking failed:", linkError || linkResult);
          }
        }
      }
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
