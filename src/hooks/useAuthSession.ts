
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export function useAuthSession() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      console.log('🔍 Checking initial session...');
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting initial session:', error);
          if (mounted) setLoading(false);
          return;
        }

        console.log('📦 Initial session data:', { 
          hasSession: !!initialSession,
          userId: initialSession?.user?.id
        });

        if (!mounted) {
          console.log('⚠️ Component unmounted, skipping state updates');
          return;
        }

        if (initialSession) {
          setSession(initialSession);
          setUser(initialSession.user);
          console.log('✅ Session set successfully');
        } else {
          console.log('ℹ️ No initial session found');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('💥 Unexpected error during session check:', error);
        if (mounted) setLoading(false);
      }
    }

    console.log('🎯 Setting up auth listeners...');
    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('🔄 Auth state changed:', { 
          event, 
          userId: currentSession?.user?.id,
          timestamp: new Date().toISOString()
        });

        if (!mounted) {
          console.log('⚠️ Component unmounted, skipping auth state update');
          return;
        }

        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          console.log('✅ Updated session state');
        } else {
          setSession(null);
          setUser(null);
          console.log('ℹ️ Cleared session state');
        }
        
        setLoading(false);
      }
    );

    return () => {
      console.log('🧹 Cleaning up auth listeners...');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const authState = {
    user,
    session,
    loading,
    isAuthenticated: !!user && !!session
  };

  console.log('🔒 Auth state:', {
    hasUser: !!authState.user,
    hasSession: !!authState.session,
    loading: authState.loading,
    isAuthenticated: authState.isAuthenticated,
    timestamp: new Date().toISOString()
  });

  return authState;
}
