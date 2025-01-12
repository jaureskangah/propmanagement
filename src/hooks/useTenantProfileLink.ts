import { useState } from "react";
import { supabase } from "@/lib/supabase";

export function useTenantProfileLink() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const linkProfile = async (email: string, tenantId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Get user profile by email
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', email)
        .single();

      if (profileError) {
        throw new Error('User profile not found');
      }

      // Update tenant with profile ID
      const { error: updateError } = await supabase
        .from('tenants')
        .update({ tenant_profile_id: profiles.id })
        .eq('id', tenantId);

      if (updateError) {
        throw updateError;
      }

      return true;
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    linkProfile,
    isLoading,
    error
  };
}