import { supabase } from "@/lib/supabase";

export function useProfileLookup() {
  const findTenantProfile = async (email: string) => {
    try {
      console.log('Looking up profile for:', email);
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (error) {
        console.error('Error looking up profile:', error);
        return null;
      }

      return profile;
    } catch (err) {
      console.error('Error in findTenantProfile:', err);
      return null;
    }
  };

  return { findTenantProfile };
}