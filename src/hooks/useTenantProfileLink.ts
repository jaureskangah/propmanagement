
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
      console.log('=== ENHANCED TENANT PROFILE LINKING ===');
      console.log('Checking for existing tenant with email:', user.email);
      
      const { data: tenant, error: tenantError } = await supabase
        .from('tenants')
        .select('*')
        .eq('email', user.email)
        .maybeSingle();

      if (tenantError) {
        console.error('❌ Error checking tenant:', tenantError);
        return;
      }

      if (tenant && !tenant.tenant_profile_id) {
        console.log('🔗 Found tenant without profile link, using enhanced RPC function...', tenant.id);
        
        // Utiliser la fonction RPC améliorée qui retourne du JSON structuré
        const { data: linkResult, error: rpcError } = await supabase
          .rpc('link_tenant_profile', {
            p_tenant_id: tenant.id,
            p_user_id: user.id
          });

        if (rpcError) {
          console.error('❌ RPC Error:', rpcError);
          return;
        }

        // Gérer à la fois les anciens (boolean) et nouveaux formats (JSON) pour backward compatibility
        let result: LinkProfileResult;
        
        if (typeof linkResult === 'boolean') {
          console.warn('⚠️ Received old boolean format from RPC, converting...');
          result = {
            success: linkResult,
            message: linkResult ? 'Tenant profile linked successfully (legacy format)' : 'Failed to link tenant profile (legacy format)',
            warning: linkResult ? 'LEGACY_FORMAT' : undefined
          };
        } else {
          result = linkResult as LinkProfileResult;
        }

        console.log('🔍 Enhanced RPC Result:', result);

        if (result.success) {
          if (result.warning === 'ALREADY_LINKED') {
            console.log('✅ Tenant was already linked to this user');
          } else if (result.warning === 'LEGACY_FORMAT') {
            console.log('⚠️ Successfully linked tenant profile using legacy format');
          } else {
            console.log('✅ Successfully linked tenant profile via enhanced RPC');
          }
        } else {
          console.error('❌ Enhanced RPC linking failed:', result.message, result.error_code);
        }
      } else if (!tenant) {
        console.log('ℹ️ No tenant found for email:', user.email);
      } else {
        console.log('✅ Tenant already linked to profile:', tenant.tenant_profile_id);
      }
    } catch (error) {
      console.error('❌ Error in linkTenantProfile:', error);
    }
  };

  const linkProfile = async (tenant: Tenant): Promise<LinkProfileResult> => {
    setIsLoading(true);
    try {
      console.log('=== ENHANCED PROFILE LINKING FOR TENANT ===');
      console.log('Linking profile for tenant using enhanced RPC:', tenant.email);
      
      // Utiliser la fonction RPC améliorée au lieu de l'UPDATE direct
      const { data: linkResult, error: rpcError } = await supabase
        .rpc('link_tenant_profile', {
          p_tenant_id: tenant.id,
          p_user_id: tenant.tenant_profile_id || tenant.id // Correction du bug potentiel
        });

      if (rpcError) {
        console.error('❌ RPC Error:', rpcError);
        return {
          success: false,
          message: `RPC Error: ${rpcError.message}`,
          error_code: 'RPC_ERROR'
        };
      }

      // Gérer à la fois les anciens (boolean) et nouveaux formats (JSON) pour backward compatibility
      let result: LinkProfileResult;
      
      if (typeof linkResult === 'boolean') {
        console.warn('⚠️ Received old boolean format from RPC, converting...');
        result = {
          success: linkResult,
          message: linkResult ? 'Tenant profile linked successfully (legacy format)' : 'Failed to link tenant profile (legacy format)',
          warning: linkResult ? 'LEGACY_FORMAT' : undefined
        };
      } else {
        result = linkResult as LinkProfileResult;
      }

      console.log('🔍 Enhanced RPC Result:', result);

      if (result.success) {
        console.log('✅ Successfully linked tenant profile via enhanced RPC');
        return {
          success: true,
          message: result.message,
          warning: result.warning
        };
      } else {
        console.error('❌ Enhanced RPC linking failed:', result.message);
        return {
          success: false,
          message: result.message || 'Failed to link tenant profile',
          error_code: result.error_code
        };
      }
    } catch (error: any) {
      console.error('❌ Error in linkProfile:', error);
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
