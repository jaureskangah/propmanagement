
import { createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useAuthSession } from '@/hooks/useAuthSession';

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
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { user, session, loading, isAuthenticated } = useAuthSession();

  // Log pour debug
  console.log('État AuthProvider:', {
    hasUser: !!user,
    hasSession: !!session,
    loading,
    isAuthenticated
  });

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, // Utiliser l'état de chargement réel
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
}
