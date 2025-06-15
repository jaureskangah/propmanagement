
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

        console.log("Auth state changed:", event);
        
        if (session?.user) {
          setUser(session.user);
          if (event === 'SIGNED_IN') {
            // Utiliser setTimeout pour éviter le blocage
            setTimeout(() => {
              if (isMounted) {
                checkTenantStatus(session.user.id);
              }
            }, 100); // Délai légèrement plus long pour s'assurer que tout est en place
          }
        } else {
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
      console.log("=== CHECKING TENANT STATUS ===");
      console.log("Checking tenant status for user:", userId);

      // Optimisation : Faire une seule requête pour récupérer à la fois le profil et les données du locataire
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select(`
          is_tenant_user,
          email,
          first_name,
          last_name,
          tenants!tenants_tenant_profile_id_fkey(
            id,
            name,
            email,
            unit_number,
            lease_start,
            lease_end,
            rent_amount,
            property_id,
            properties:property_id(name)
          )
        `)
        .eq('id', userId)
        .maybeSingle();

      console.log("User data with tenant info:", userData);

      if (userError) {
        console.error("Error fetching user data:", userError);
        setIsTenant(false);
        setTenantData(null);
        setLoading(false);
        return;
      }

      if (!userData) {
        console.log("No profile found for user");
        setIsTenant(false);
        setTenantData(null);
        setLoading(false);
        return;
      }

      // Vérifier si l'utilisateur est marqué comme locataire ET a des données de locataire
      const hasTenantData = userData.tenants && userData.tenants.length > 0;
      const isMarkedAsTenant = userData.is_tenant_user;

      if (isMarkedAsTenant && hasTenantData) {
        console.log("✅ User is a tenant:", userData.tenants[0]);
        setIsTenant(true);
        setTenantData(userData.tenants[0]);
      } else {
        console.log("❌ User is not a tenant or no tenant data found");
        setIsTenant(false);
        setTenantData(null);
      }
    } catch (err) {
      console.error("Exception checking tenant status:", err);
      setIsTenant(false);
      setTenantData(null);
    } finally {
      setLoading(false);
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
