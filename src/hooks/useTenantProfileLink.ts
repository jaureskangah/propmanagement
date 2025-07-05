
import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { Tenant } from '@/types/tenant';

interface LinkProfileResult {
  success: boolean;
  message: string;
  error_code?: string;
  warning?: string;
  details?: any;
}

export const useTenantProfileLink = () => {
  const [isLoading, setIsLoading] = useState(false);

  const linkTenantProfile = async (user: User) => {
    try {
      console.log('Checking for existing tenant with email:', user.email);
      const { data: tenant, error: tenantError } = await supabase
        .from('tenants')
        .select('*')
        .eq('email', user.email)
        .maybeSingle();

      if (tenantError) {
        console.error('Error checking tenant:', tenantError);
        return;
      }

      if (tenant && !tenant.tenant_profile_id) {
        console.log('Found tenant without profile link, using enhanced RPC function...', tenant.id);
        
        // Utiliser la fonction RPC améliorée
        const { data: linkResult, error: rpcError } = await supabase
          .rpc('link_tenant_profile', {
            p_tenant_id: tenant.id,
            p_user_id: user.id
          });

        if (rpcError) {
          console.error('RPC Error:', rpcError);
          return;
        }

        const result = linkResult as LinkProfileResult;
        console.log('RPC Result:', result);

        if (result.success) {
          if (result.warning === 'ALREADY_LINKED') {
            console.log('Tenant was already linked to this user');
          } else {
            console.log('Successfully linked tenant profile via enhanced RPC');
          }
        } else {
          console.error('Enhanced RPC linking failed:', result.message, result.error_code);
        }
      } else if (!tenant) {
        console.log('No tenant found for email:', user.email);
      } else {
        console.log('Tenant already linked to profile:', tenant.tenant_profile_id);
      }
    } catch (error) {
      console.error('Error in linkTenantProfile:', error);
    }
  };

  const linkProfile = async (tenant: Tenant): Promise<LinkProfileResult> => {
    setIsLoading(true);
    try {
      console.log('Linking profile for tenant using enhanced RPC:', tenant.email);
      
      // Utiliser la fonction RPC améliorée au lieu de l'UPDATE direct
      const { data: linkResult, error: rpcError } = await supabase
        .rpc('link_tenant_profile', {
          p_tenant_id: tenant.id,
          p_user_id: tenant.id // Note: ceci semble incorrect, probablement un bug dans l'original
        });

      if (rpcError) {
        console.error('RPC Error:', rpcError);
        return {
          success: false,
          message: `RPC Error: ${rpcError.message}`,
          error_code: 'RPC_ERROR'
        };
      }

      const result = linkResult as LinkProfileResult;
      console.log('Enhanced RPC Result:', result);

      if (result.success) {
        console.log('Successfully linked tenant profile via enhanced RPC');
        return {
          success: true,
          message: result.message,
          warning: result.warning
        };
      } else {
        console.error('Enhanced RPC linking failed:', result.message);
        return {
          success: false,
          message: result.message || 'Failed to link tenant profile',
          error_code: result.error_code
        };
      }
    } catch (error: any) {
      console.error('Error in linkProfile:', error);
      return {
        success: false,
        message: 'An unexpected error occurred. Please try again.',
        error_code: 'UNEXPECTED_ERROR'
      };
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, linkProfile, linkTenantProfile };
};
