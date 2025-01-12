import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check active sessions and sets the user
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('AuthProvider: Session check result:', session?.user ?? 'No user');
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error checking session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('AuthProvider: Auth state changed:', _event, session?.user ?? 'No user');
      
      if (_event === 'SIGNED_IN' && session?.user) {
        // Update the profile with is_tenant_user if it's a new signup
        const isTenantUser = session.user.user_metadata.is_tenant_user;
        if (isTenantUser !== undefined) {
          const { error } = await supabase
            .from('profiles')
            .update({ is_tenant_user: isTenantUser })
            .eq('id', session.user.id);
          
          if (error) {
            console.error('Error updating profile:', error);
          }
        }
      }
      
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Subscribe to real-time notifications
    const channel = supabase
      .channel('db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'maintenance_requests'
        },
        (payload) => {
          console.log('Real-time notification:', payload);
          
          if (payload.eventType === 'INSERT') {
            toast({
              title: "Nouvelle demande de maintenance",
              description: payload.new.title,
            });
          } else if (payload.eventType === 'UPDATE') {
            toast({
              title: "Mise à jour de maintenance",
              description: `La demande "${payload.new.title}" a été mise à jour`,
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tenant_communications'
        },
        (payload) => {
          console.log('Real-time communication:', payload);
          
          if (payload.eventType === 'INSERT') {
            toast({
              title: "Nouvelle communication",
              description: payload.new.subject,
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tenant_payments'
        },
        (payload) => {
          console.log('Real-time payment:', payload);
          
          if (payload.eventType === 'INSERT') {
            toast({
              title: "Nouveau paiement",
              description: `Nouveau paiement de ${payload.new.amount}€ reçu`,
            });
          } else if (payload.eventType === 'UPDATE' && payload.new.status === 'completed') {
            toast({
              title: "Paiement confirmé",
              description: `Paiement de ${payload.new.amount}€ confirmé`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [toast]);

  console.log('AuthProvider: Current user state:', user);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}