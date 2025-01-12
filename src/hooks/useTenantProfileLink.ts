import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import type { Tenant } from "@/types/tenant";

interface UseTenantProfileLinkReturn {
  isLinking: boolean;
  linkProfile: (tenant: Tenant) => Promise<void>;
}

export function useTenantProfileLink(): UseTenantProfileLinkReturn {
  const [isLinking, setIsLinking] = useState(false);
  const { toast } = useToast();

  const findUserByEmail = async (email: string): Promise<User | null> => {
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.error("Error fetching users:", error);
      return null;
    }

    return users?.find(user => user.email === email) || null;
  };

  const checkTenantProfile = async (userId: string) => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, is_tenant_user')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("Error checking profile:", error);
      throw error;
    }

    return profile;
  };

  const updateTenantRecord = async (tenantId: string, profileId: string) => {
    const { error } = await supabase
      .from('tenants')
      .update({ tenant_profile_id: profileId })
      .eq('id', tenantId);

    if (error) {
      console.error("Error updating tenant:", error);
      throw error;
    }
  };

  const linkProfile = async (tenant: Tenant) => {
    try {
      setIsLinking(true);
      console.log("Attempting to link tenant profile:", tenant.email);

      const matchingUser = await findUserByEmail(tenant.email);

      if (!matchingUser) {
        toast({
          title: "User not found",
          description: "No tenant account found with this email. Please ask the tenant to create an account first.",
          variant: "destructive",
        });
        return;
      }

      const profile = await checkTenantProfile(matchingUser.id);

      if (!profile?.is_tenant_user) {
        toast({
          title: "Invalid account type",
          description: "This account is not registered as a tenant account.",
          variant: "destructive",
        });
        return;
      }

      await updateTenantRecord(tenant.id, profile.id);

      toast({
        title: "Success",
        description: "Tenant profile has been linked successfully.",
      });
    } catch (error) {
      console.error("Error linking tenant profile:", error);
      toast({
        title: "Error",
        description: "Failed to link tenant profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLinking(false);
    }
  };

  return { isLinking, linkProfile };
}