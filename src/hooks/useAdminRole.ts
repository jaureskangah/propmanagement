import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';

export const useAdminRole = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      console.log('🔍 DEBUG: useAdminRole - Checking admin role for user:', user?.id);
      
      if (!user) {
        console.log('🔍 DEBUG: useAdminRole - No user found');
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // Debug: Check current auth session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('🔍 DEBUG: useAdminRole - Current session:', { 
          hasSession: !!session, 
          userId: session?.user?.id, 
          sessionError 
        });

        // Use the has_role function directly
        console.log('🔍 DEBUG: useAdminRole - Calling has_role function for user:', user.id);
        const { data: hasAdminRole, error: roleError } = await supabase
          .rpc('has_role', { role: 'admin' });

        console.log('🔍 DEBUG: useAdminRole - has_role result:', { hasAdminRole, roleError });

        if (roleError) {
          console.error('❌ ERROR: useAdminRole - Error calling has_role:', roleError);
          setIsAdmin(false);
        } else {
          const isAdminUser = !!hasAdminRole;
          console.log('🔍 DEBUG: useAdminRole - Final admin status:', isAdminUser);
          setIsAdmin(isAdminUser);
        }
      } catch (error) {
        console.error('❌ ERROR: useAdminRole - Error in admin role check:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminRole();
  }, [user]);

  return { isAdmin, loading };
};