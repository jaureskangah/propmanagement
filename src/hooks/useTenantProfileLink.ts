import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import type { Tenant } from "@/types/tenant";

interface InvitationResult {
  success: boolean;
  message: string;
}

export function useTenantProfileLink() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const checkExistingInvitation = async (email: string): Promise<boolean> => {
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
    }
  };

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

      // Send invitation email
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

  const updateTenantProfile = async (tenantId: string, profileId: string) => {
    try {
      console.log('Updating tenant profile:', { tenantId, profileId });
      const { error } = await supabase
        .from("tenants")
        .update({ 
          tenant_profile_id: profileId,
          updated_at: new Date().toISOString()
        })
        .eq("id", tenantId);

      if (error) {
        console.error('Error updating tenant:', error);
        throw error;
      }

      // Send confirmation email
      const { data: tenant } = await supabase
        .from("tenants")
        .select("*")
        .eq("id", tenantId)
        .single();

      if (tenant) {
        await supabase.functions.invoke('send-tenant-email', {
          body: {
            to: [tenant.email],
            subject: "Tenant profile linked successfully",
            content: `
              <p>Hello ${tenant.name},</p>
              <p>Your profile has been successfully linked to the tenant portal. You can now access all features.</p>
              <p>Log in to your account to get started.</p>
            `
          }
        });
      }

      return true;
    } catch (err) {
      console.error('Error in updateTenantProfile:', err);
      throw err;
    }
  };

  const linkProfile = async (tenant: Tenant): Promise<boolean> => {
    if (isLoading) return false;
    
    setIsLoading(true);
    setError("");

    try {
      console.log('Attempting to link tenant profile for:', tenant.email);
      
      const profile = await findTenantProfile(tenant.email);

      if (!profile) {
        console.log('No profile found, sending invitation');
        const hasExistingInvite = await checkExistingInvitation(tenant.email);
        
        if (hasExistingInvite) {
          toast({
            title: "Information",
            description: "An invitation has already been sent to this email. The tenant needs to create their account to complete the linking process.",
          });
          setIsLoading(false);
          return false;
        }

        const invitationResult = await createInvitation(tenant);
        toast({
          title: invitationResult.success ? "Invitation Sent" : "Error",
          description: invitationResult.message,
          variant: invitationResult.success ? "default" : "destructive",
        });
        setIsLoading(false);
        return invitationResult.success;
      }

      console.log('Profile found, updating tenant');
      await updateTenantProfile(tenant.id, profile.id);
      
      console.log('Tenant profile linked successfully');
      toast({
        title: "Success",
        description: "Tenant profile has been linked successfully",
      });

      setIsLoading(false);
      return true;
    } catch (err: any) {
      console.error('Error in linkProfile:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: "An error occurred while linking the profile",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };

  return {
    linkProfile,
    isLoading,
    error,
  };
}