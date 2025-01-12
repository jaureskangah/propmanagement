import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export async function updateTenantProfile(user: User) {
  const isTenantUser = user.user_metadata.is_tenant_user;
  if (isTenantUser !== undefined) {
    const { error } = await supabase
      .from('profiles')
      .update({ is_tenant_user: isTenantUser })
      .eq('id', user.id);
    
    if (error) {
      console.error('Error updating profile:', error);
    }
  }
}