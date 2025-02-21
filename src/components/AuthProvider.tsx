
import { createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useAuthSession } from '@/hooks/useAuthSession';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isAuthenticated: false
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { user, session, loading, isAuthenticated } = useAuthSession();

  // Log pour debug
  console.log('AuthProvider state:', {
    hasUser: !!user,
    hasSession: !!session,
    loading,
    isAuthenticated: !!user && !!session
  });

  // Important: Ne pas afficher le loader pendant la phase initiale
  // Cela permet d'éviter le blocage infini
  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading: false, // Forcer loading à false pour débloquer
      isAuthenticated: !!user && !!session
    }}>
      {children}
    </AuthContext.Provider>
  );
}
