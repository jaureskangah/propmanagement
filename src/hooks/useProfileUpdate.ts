import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export async function updateTenantProfile(user: User) {
  try {
    console.log('Updating tenant profile for user:', user.email);
    
    const isTenantUser = user.user_metadata.is_tenant_user;
    if (isTenantUser !== undefined) {
      const { data: profile, error } = await supabase
        .from('profiles')
        .update({ is_tenant_user: isTenantUser })
        .eq('id', user.id)
        .select()
        .maybeSingle();
      
      if (error) {
        console.error('Error updating profile:', error);
        return;
      }

      console.log('Profile update result:', profile);
    }
  } catch (error) {
    console.error('Error in updateTenantProfile:', error);
  }
}