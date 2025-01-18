import { supabase } from "@/lib/supabase";

export function useProfileUpdate() {
  const updateTenantProfile = async (tenantId: string, profileId: string) => {
    try {
      console.log('Updating tenant profile:', { tenantId, profileId });
      const { error } = await supabase
        .from("tenants")
        .update({ 
          tenant_profile_id: profileId,
          updated_at: new Date().toISOString()
        })
        .eq("id", tenantId);

      if (error) {
        console.error('Error updating tenant:', error);
        throw error;
      }

      const { data: tenant } = await supabase
        .from("tenants")
        .select("*")
        .eq("id", tenantId)
        .single();

      if (tenant) {
        await supabase.functions.invoke('send-tenant-email', {
          body: {
            to: [tenant.email],
            subject: "Tenant profile linked successfully",
            content: `
              <p>Hello ${tenant.name},</p>
              <p>Your profile has been successfully linked to the tenant portal. You can now access all features.</p>
              <p>Log in to your account to get started.</p>
            `
          }
        });
      }

      return true;
    } catch (err) {
      console.error('Error in updateTenantProfile:', err);
      throw err;
    }
  };

  return { updateTenantProfile };
}