import { useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Tenant } from "@/types/tenant";

export function useTenantProfileLink() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const linkProfile = async (tenant: Tenant) => {
    setIsLoading(true);
    setError("");

    try {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", tenant.email)
        .single();

      if (profileError) {
        throw profileError;
      }

      if (!profile) {
        throw new Error("No profile found for this email");
      }

      const { error: updateError } = await supabase
        .from("tenants")
        .update({ tenant_profile_id: profile.id })
        .eq("id", tenant.id);

      if (updateError) {
        throw updateError;
      }

      return true;
    } catch (err: any) {
      setError(err.message);
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