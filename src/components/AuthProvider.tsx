
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
          }
          setLoading(false);
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
            // Check tenant status after signing in
            setTimeout(async () => {
              if (isMounted) {
                await checkTenantStatus(session.user.id);
              }
            }, 100);
          }
        } else {
          setUser(null);
          setIsTenant(false);
          setTenantData(null);
        }
        
        setLoading(false);
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
      console.log("Checking tenant status for user:", userId);

      // D'abord, vérifier le profil utilisateur
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('is_tenant_user')
        .eq('id', userId)
        .maybeSingle();

      console.log("Profile data:", profileData);

      // Si l'utilisateur n'est pas marqué comme tenant dans son profil, ce n'est pas un locataire
      if (!profileData?.is_tenant_user) {
        console.log("User is not marked as tenant in profile");
        setIsTenant(false);
        setTenantData(null);
        return;
      }

      // Vérifier s'il y a une entrée dans la table tenants avec tenant_profile_id correspondant
      const { data: tenantRecord, error: tenantError } = await supabase
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

      if (tenantError) {
        console.error("Error checking tenant record:", tenantError);
        setIsTenant(false);
        setTenantData(null);
        return;
      }

      if (tenantRecord) {
        console.log("User is a tenant:", tenantRecord);
        setIsTenant(true);
        setTenantData(tenantRecord);
      } else {
        console.log("User is marked as tenant but no tenant record found");
        setIsTenant(false);
        setTenantData(null);
      }
    } catch (err) {
      console.error("Exception checking tenant status:", err);
      setIsTenant(false);
      setTenantData(null);
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
