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
        // Check if user has admin role directly from the table
        console.log('🔍 DEBUG: useAdminRole - Querying user_roles table for user:', user.id);
        const { data: adminRole, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();

        console.log('🔍 DEBUG: useAdminRole - Query result:', { adminRole, roleError });

        if (roleError) {
          console.error('❌ ERROR: useAdminRole - Error checking admin role:', roleError);
          setIsAdmin(false);
        } else {
          const isAdminUser = !!adminRole;
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