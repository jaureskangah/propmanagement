
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

  const fetchTenantData = async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('get_user_tenant_data', {
        p_user_id: userId
      });

      if (error) {
        console.error("Error fetching tenant data:", error);
        return { isTenant: false, tenantData: null };
      }

      if (data && data.length > 0) {
        console.log("User is a tenant:", data[0]);
        return { isTenant: true, tenantData: data[0] };
      } else {
        console.log("User is not a tenant");
        return { isTenant: false, tenantData: null };
      }
    } catch (err) {
      console.error("Exception fetching tenant data:", err);
      return { isTenant: false, tenantData: null };
    }
  };

  useEffect(() => {
    // Check active session
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error checking session:", error);
        setUser(null);
        setIsTenant(false);
        setTenantData(null);
      } else if (data?.session) {
        const sessionUser = data.session.user;
        setUser(sessionUser);
        
        // Vérifier si l'utilisateur est un locataire
        const { isTenant: userIsTenant, tenantData: userTenantData } = await fetchTenantData(sessionUser.id);
        setIsTenant(userIsTenant);
        setTenantData(userTenantData);
      } else {
        setUser(null);
        setIsTenant(false);
        setTenantData(null);
      }
      
      setLoading(false);
    };

    checkSession();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        
        if (session?.user) {
          setUser(session.user);
          
          // Vérifier si l'utilisateur est un locataire
          const { isTenant: userIsTenant, tenantData: userTenantData } = await fetchTenantData(session.user.id);
          setIsTenant(userIsTenant);
          setTenantData(userTenantData);
        } else {
          setUser(null);
          setIsTenant(false);
          setTenantData(null);
        }
        
        setLoading(false);
      }
    );

    // Cleanup
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      if (data.user) {
        setUser(data.user);
        
        // Vérifier si l'utilisateur est un locataire
        const { isTenant: userIsTenant, tenantData: userTenantData } = await fetchTenantData(data.user.id);
        setIsTenant(userIsTenant);
        setTenantData(userTenantData);
      }
      
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  // Sign up function
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

  // Sign out function
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsTenant(false);
      setTenantData(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // For debugging
  console.log("AuthProvider rendering with values:", { 
    isAuthenticated, 
    loading, 
    isTenant, 
    tenantData: tenantData ? tenantData.tenant_name : null 
  });

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
