import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import type { Tenant } from "@/types/tenant";

export function useTenantProfileLink() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const linkProfile = async (tenant: Tenant) => {
    setIsLoading(true);
    setError("");

    try {
      console.log('Attempting to link tenant profile for:', tenant.email);
      
      // First check if a profile exists for this email
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("id, email")
        .eq("email", tenant.email)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        throw profileError;
      }

      if (!profiles) {
        const errorMsg = "No profile found for this email. Please make sure the tenant has created an account.";
        console.error(errorMsg);
        toast({
          title: "Profile Not Found",
          description: errorMsg,
          variant: "destructive",
        });
        throw new Error(errorMsg);
      }

      console.log('Found profile:', profiles);

      // Update the tenant record with the profile ID
      const { error: updateError } = await supabase
        .from("tenants")
        .update({ 
          tenant_profile_id: profiles.id,
          updated_at: new Date().toISOString()
        })
        .eq("id", tenant.id);

      if (updateError) {
        console.error('Error updating tenant:', updateError);
        throw updateError;
      }

      console.log('Successfully linked tenant profile');
      toast({
        title: "Success",
        description: "Tenant profile has been linked successfully",
      });

      return true;
    } catch (err: any) {
      console.error('Error in linkProfile:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    linkProfile,
    isLoading,
    error,
  };
}