
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

        console.log("=== AUTH STATE CHANGE - ENHANCED VERSION ===");
        console.log("Event:", event);
        console.log("Session exists:", !!session);
        console.log("User ID:", session?.user?.id);
        
        if (session?.user) {
          setUser(session.user);
          if (event === 'SIGNED_IN') {
            // Délai plus long pour s'assurer que la liaison est terminée
            setTimeout(() => {
              if (isMounted) {
                console.log("Checking tenant status after sign in with enhanced recovery...");
                checkTenantStatusWithRecovery(session.user.id);
              }
            }, 1000);
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
      console.log("=== CHECKING TENANT STATUS - ENHANCED VERSION ===");
      console.log("Checking tenant status for user:", userId);

      // ÉTAPE 1: Vérifier directement dans la table tenants si le tenant existe
      const { data: tenantData, error: tenantError } = await supabase
        .from('tenants')
        .select(`
          id,
          name,
          email,
          unit_number,
          lease_start,
          lease_end,
          rent_amount,
          property_id,
          properties:property_id(name)
        `)
        .eq('tenant_profile_id', userId)
        .maybeSingle();

      console.log("=== TENANT CHECK RESULTS ===");
      console.log("Tenant data found:", tenantData);
      console.log("Tenant query error:", tenantError);

      if (tenantError) {
        console.error("❌ Error fetching tenant data:", tenantError);
        setIsTenant(false);
        setTenantData(null);
        setLoading(false);
        return;
      }

      // ÉTAPE 2: Si aucun tenant trouvé, l'utilisateur n'est PAS un locataire
      if (!tenantData) {
        console.log("❌ No tenant found for this user - user is NOT a tenant");
        
        // ÉTAPE 3: Vérifier si cet utilisateur était précédemment un locataire
        const { data: profileData } = await supabase
          .from('profiles')
          .select('is_tenant_user, email')
          .eq('id', userId)
          .maybeSingle();

        // Si l'utilisateur était marqué comme locataire mais n'a plus d'entrée tenant,
        // cela signifie que son compte locataire a été supprimé
        if (profileData?.is_tenant_user) {
          console.log("🚨 CRITICAL: User was a tenant but tenant record was deleted!");
          console.log("🧹 Cleaning up profile and forcing sign out...");
          
          // Nettoyer le profil
          await supabase
            .from('profiles')
            .update({ is_tenant_user: false })
            .eq('id', userId);
          
          // Forcer la déconnexion immédiate
          await supabase.auth.signOut();
          
          // Rediriger vers la page d'authentification avec un message
          alert("Votre compte locataire a été supprimé. Veuillez demander une nouvelle invitation à votre propriétaire.");
          window.location.href = '/auth';
          return;
        }

        setIsTenant(false);
        setTenantData(null);
        setLoading(false);
        return;
      }

      // ÉTAPE 4: Tenant trouvé - l'utilisateur est un locataire valide
      console.log("✅ User is confirmed as a valid tenant:", tenantData);
      setIsTenant(true);
      setTenantData(tenantData);

    } catch (err) {
      console.error("❌ Exception checking tenant status:", err);
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
