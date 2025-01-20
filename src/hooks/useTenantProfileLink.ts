import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { Tenant } from '@/types/tenant';

interface LinkProfileResult {
  success: boolean;
  message: string;
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
        console.log('Found tenant without profile link, updating...', tenant.id);
        const { error: updateError } = await supabase
          .from('tenants')
          .update({ tenant_profile_id: user.id })
          .eq('id', tenant.id)
          .eq('email', user.email);

        if (updateError) {
          console.error('Error updating tenant:', updateError);
        } else {
          console.log('Successfully linked tenant profile');
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
      console.log('Linking profile for tenant:', tenant.email);
      const { error: updateError } = await supabase
        .from('tenants')
        .update({ tenant_profile_id: tenant.id })
        .eq('id', tenant.id)
        .eq('email', tenant.email);

      if (updateError) {
        console.error('Error linking tenant profile:', updateError);
        return {
          success: false,
          message: 'Failed to link tenant profile. Please try again.',
        };
      }

      console.log('Successfully linked tenant profile');
      return {
        success: true,
        message: 'Successfully linked tenant profile',
      };
    } catch (error) {
      console.error('Error in linkProfile:', error);
      return {
        success: false,
        message: 'An unexpected error occurred. Please try again.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, linkProfile, linkTenantProfile };
};