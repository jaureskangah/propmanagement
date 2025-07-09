import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';

export const useAdminRole = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // Check if user has admin role
        const { data: hasAdminRole, error: roleError } = await supabase
          .rpc('has_role', { role: 'admin' });

        if (roleError) {
          console.error('Error checking admin role:', roleError);
          setIsAdmin(false);
        } else {
          setIsAdmin(hasAdminRole || false);
        }
      } catch (error) {
        console.error('Error in admin role check:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminRole();
  }, [user]);

  return { isAdmin, loading };
};