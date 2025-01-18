import { supabase } from "@/lib/supabase";
import type { Tenant } from "@/types/tenant";
import { toast } from "@/hooks/use-toast";

interface InvitationResult {
  success: boolean;
  message: string;
}

export function useInvitationService() {
  const sendInvitationEmail = async (tenant: Tenant): Promise<boolean> => {
    try {
      console.log('Sending invitation email to:', tenant.email);
      const response = await supabase.functions.invoke('send-tenant-email', {
        body: {
          to: [tenant.email],
          subject: "Invitation to join tenant portal",
          content: `
            <p>Hello ${tenant.name},</p>
            <p>You have been invited to join the tenant portal. To create your account, please click the link below:</p>
            <p><a href="${window.location.origin}/signup">Create my account</a></p>
            <p>Once your account is created, you will be able to access all tenant portal features.</p>
          `
        }
      });

      if (response.error) {
        console.error('Error sending invitation email:', response.error);
        throw new Error(response.error.message);
      }

      console.log('Invitation email sent successfully');
      return true;
    } catch (err) {
      console.error('Error in sendInvitationEmail:', err);
      return false;
    }
  };

  const createInvitation = async (tenant: Tenant): Promise<InvitationResult> => {
    try {
      console.log('Creating invitation for:', tenant.email);
      const { error: inviteError } = await supabase
        .from("tenant_invitations")
        .insert({
          tenant_id: tenant.id,
          email: tenant.email,
          token: crypto.randomUUID(),
          status: 'pending',
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (inviteError) {
        console.error('Error creating invitation:', inviteError);
        return {
          success: false,
          message: "Unable to create invitation"
        };
      }

      const emailSent = await sendInvitationEmail(tenant);
      if (!emailSent) {
        return {
          success: false,
          message: "Invitation created but email could not be sent"
        };
      }

      return {
        success: true,
        message: "Invitation created and email sent successfully"
      };
    } catch (err) {
      console.error('Error in createInvitation:', err);
      return {
        success: false,
        message: "Error creating invitation"
      };
    }
  };

  return { createInvitation };
}