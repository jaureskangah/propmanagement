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
            <p><a href="https://propmanagement.app/signup">Create my account</a></p>
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
      
      // Vérifier si le profil existe déjà
      const { data: existingProfile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", tenant.email)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error checking existing profile:', profileError);
        return {
          success: false,
          message: "Error checking profile status"
        };
      }

      if (existingProfile) {
        console.log('Profile found, updating tenant directly');
        const { error: updateError } = await supabase
          .from("tenants")
          .update({ 
            tenant_profile_id: existingProfile.id,
            updated_at: new Date().toISOString()
          })
          .eq("id", tenant.id);

        if (updateError) {
          console.error('Error updating tenant:', updateError);
          return {
            success: false,
            message: "Failed to link existing profile"
          };
        }

        return {
          success: true,
          message: "Profile successfully linked"
        };
      }

      // Si pas de profil existant, créer une invitation
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