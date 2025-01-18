import { useState } from "react";
import { supabase } from "@/lib/supabase";

export function useInvitationCheck() {
  const [isChecking, setIsChecking] = useState(false);

  const checkExistingInvitation = async (email: string): Promise<boolean> => {
    setIsChecking(true);
    try {
      console.log('Checking existing invitations for:', email);
      const { data: existingInvites, error } = await supabase
        .from("tenant_invitations")
        .select("*")
        .eq("email", email)
        .eq("status", "pending")
        .maybeSingle();

      if (error) {
        console.error('Error checking invitations:', error);
        return false;
      }

      return !!existingInvites;
    } catch (err) {
      console.error('Error in checkExistingInvitation:', err);
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  return {
    checkExistingInvitation,
    isChecking
  };
}