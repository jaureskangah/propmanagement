import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";

export const useInvitationService = (tenantId: string, onClose: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const sendInvitation = async (email: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to send invitations",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);

    try {
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const { error } = await supabase
        .from('tenant_invitations')
        .insert({
          tenant_id: tenantId,
          email,
          token,
          expires_at: expiresAt.toISOString(),
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Invitation sent",
        description: "The tenant will receive an email with instructions",
      });

      onClose();
      return true;
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast({
        title: "Error",
        description: "Failed to send invitation. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    sendInvitation
  };
};