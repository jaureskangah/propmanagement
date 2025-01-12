import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import type { Tenant } from "@/types/tenant";

interface LinkTenantProfileProps {
  tenant: Tenant;
  onProfileLinked: () => void;
}

export function LinkTenantProfile({ tenant, onProfileLinked }: LinkTenantProfileProps) {
  const [isLinking, setIsLinking] = useState(false);
  const { toast } = useToast();

  const handleLinkProfile = async () => {
    try {
      setIsLinking(true);
      console.log("Attempting to link tenant profile:", tenant.email);

      // First check if there's a profile with matching email
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, is_tenant_user')
        .eq('email', tenant.email)
        .single();

      if (profileError) {
        throw profileError;
      }

      if (!profiles) {
        toast({
          title: "Profile not found",
          description: "No tenant account found with this email. Please ask the tenant to create an account first.",
          variant: "destructive",
        });
        return;
      }

      if (!profiles.is_tenant_user) {
        toast({
          title: "Invalid account type",
          description: "This account is not registered as a tenant account.",
          variant: "destructive",
        });
        return;
      }

      // Update the tenant record with the profile ID
      const { error: updateError } = await supabase
        .from('tenants')
        .update({ tenant_profile_id: profiles.id })
        .eq('id', tenant.id);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Success",
        description: "Tenant profile has been linked successfully.",
      });
      
      onProfileLinked();
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

  return (
    <div className="flex items-center gap-4">
      <Button 
        onClick={handleLinkProfile} 
        disabled={isLinking || !!tenant.tenant_profile_id}
        variant={tenant.tenant_profile_id ? "secondary" : "default"}
      >
        {tenant.tenant_profile_id 
          ? "Profile Linked" 
          : isLinking 
            ? "Linking..." 
            : "Link Tenant Profile"}
      </Button>
    </div>
  );
}