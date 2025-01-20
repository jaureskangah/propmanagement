import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export const useTenantProfileLink = () => {
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

  return { linkTenantProfile };
};