import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OnboardingEmailRequest {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isOwner?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Starting user-onboarding-email function");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const { userId, email, firstName, lastName, isOwner }: OnboardingEmailRequest = await req.json();

    console.log("Processing onboarding email for:", { userId, email, isOwner });

    if (!email) {
      throw new Error("Email is required");
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const displayName = firstName && lastName ? `${firstName} ${lastName}` : firstName || "Utilisateur";
    const welcomeMessage = isOwner 
      ? "Bienvenue sur votre plateforme de gestion immobilière !"
      : "Bienvenue sur la plateforme locative !";

    const emailContent = isOwner ? `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
            <span style="color: white; font-size: 24px; font-weight: bold;">P</span>
          </div>
          <h1 style="color: #1f2937; margin: 0; font-size: 28px;">${welcomeMessage}</h1>
        </div>
        
        <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <h2 style="color: #374151; margin-top: 0;">Bonjour ${displayName},</h2>
          <p style="color: #6b7280; line-height: 1.6; margin-bottom: 16px;">
            Félicitations ! Votre compte propriétaire a été créé avec succès. Vous pouvez maintenant gérer vos propriétés, locataires et toutes vos activités immobilières en un seul endroit.
          </p>
        </div>

        <div style="margin-bottom: 32px;">
          <h3 style="color: #374151; margin-bottom: 16px;">🚀 Premiers pas recommandés :</h3>
          <ul style="color: #6b7280; line-height: 1.8; padding-left: 20px;">
            <li>Ajoutez vos premières propriétés</li>
            <li>Configurez vos locataires</li>
            <li>Explorez le tableau de bord</li>
            <li>Personnalisez vos préférences</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${supabaseUrl.replace('supabase.co', 'lovableproject.com')}/dashboard" 
             style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 500;">
            Accéder au Tableau de Bord
          </a>
        </div>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 24px; margin-top: 32px;">
          <p style="color: #9ca3af; font-size: 14px; text-align: center; margin: 0;">
            Besoin d'aide ? Contactez notre équipe support à tout moment.
          </p>
        </div>
      </div>
    ` : `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
            <span style="color: white; font-size: 24px; font-weight: bold;">🏠</span>
          </div>
          <h1 style="color: #1f2937; margin: 0; font-size: 28px;">${welcomeMessage}</h1>
        </div>
        
        <div style="background: #f0fdf4; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <h2 style="color: #374151; margin-top: 0;">Bonjour ${displayName},</h2>
          <p style="color: #6b7280; line-height: 1.6; margin-bottom: 16px;">
            Bienvenue ! Votre compte locataire a été créé avec succès. Vous pouvez maintenant accéder à votre espace personnel pour gérer votre location.
          </p>
        </div>

        <div style="margin-bottom: 32px;">
          <h3 style="color: #374151; margin-bottom: 16px;">🏡 Votre espace locataire :</h3>
          <ul style="color: #6b7280; line-height: 1.8; padding-left: 20px;">
            <li>Consultez vos informations de bail</li>
            <li>Effectuez des demandes de maintenance</li>
            <li>Communiquez avec votre propriétaire</li>
            <li>Consultez vos documents</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${supabaseUrl.replace('supabase.co', 'lovableproject.com')}/tenant-dashboard" 
             style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 500;">
            Accéder à Mon Espace
          </a>
        </div>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 24px; margin-top: 32px;">
          <p style="color: #9ca3af; font-size: 14px; text-align: center; margin: 0;">
            Des questions ? Votre propriétaire ou notre équipe support sont là pour vous aider.
          </p>
        </div>
      </div>
    `;

    // Send welcome email
    const emailResponse = await resend.emails.send({
      from: "Gestionnaire Immobilier <onboarding@resend.dev>",
      to: [email],
      subject: isOwner ? "🏢 Bienvenue sur votre plateforme de gestion immobilière" : "🏠 Bienvenue sur votre espace locataire",
      html: emailContent,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Onboarding email sent successfully",
      emailId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error in user-onboarding-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to send onboarding email",
        success: false 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);