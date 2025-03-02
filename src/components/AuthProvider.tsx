
import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("AuthProvider initializing", location.pathname);
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      console.log("Initial auth session:", initialSession ? "Found" : "None");
      
      if (initialSession) {
        setSession(initialSession);
        setUser(initialSession.user);
        
        // Handle redirection based on user type, but only if we're at login or root
        if (location.pathname === '/auth') {
          const isTenantUser = initialSession.user?.user_metadata?.is_tenant_user;
          console.log("User is tenant:", isTenantUser);
          
          if (isTenantUser) {
            navigate('/tenant/dashboard', { replace: true });
          } else {
            navigate('/dashboard', { replace: true });
          }
        }
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("Auth state change:", event, newSession ? "Session exists" : "No session");
      
      if (newSession) {
        setSession(newSession);
        setUser(newSession.user);
        
        // Only redirect if on login page
        if (location.pathname === '/auth') {
          const isTenantUser = newSession.user?.user_metadata?.is_tenant_user;
          console.log("Redirecting based on user type:", isTenantUser ? "tenant" : "owner");
          
          if (isTenantUser) {
            navigate('/tenant/dashboard', { replace: true });
          } else {
            navigate('/dashboard', { replace: true });
          }
        }
      } else {
        setSession(null);
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  const signOut = async () => {
    console.log("Signing out user");
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    navigate('/auth', { replace: true });
  };

  const value = {
    session,
    user,
    loading,
    isAuthenticated: !!session?.user,
    signOut
  };

  console.log("AuthProvider rendering with values:", { isAuthenticated: !!session?.user, loading });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
