import { createContext, useContext } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useAuthSession } from '@/hooks/useAuthSession';
import { updateTenantProfile } from '@/hooks/useProfileUpdate';
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, setUser, loading, setLoading } = useAuthSession();
  useRealtimeNotifications();

  // Listen for auth state changes
  supabase.auth.onAuthStateChange(async (_event, session) => {
    console.log('AuthProvider: Auth state changed:', _event, session?.user ?? 'No user');
    
    if (_event === 'SIGNED_IN' && session?.user) {
      await updateTenantProfile(session.user);
    }
    
    setUser(session?.user ?? null);
    setLoading(false);
  });

  console.log('AuthProvider: Current user state:', user);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}