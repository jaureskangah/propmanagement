
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  console.log("Starting notify-communication function");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { tenantId, subject, content, isFromTenant } = await req.json();
    
    console.log("Request data:", { tenantId, subject, content, isFromTenant });

    // Fetch tenant information
    const { data: tenant, error: tenantError } = await supabase
      .from("tenants")
      .select("email, name, property_id")
      .eq("id", tenantId)
      .single();

    if (tenantError || !tenant) {
      console.error("Error fetching tenant:", tenantError);
      throw new Error("Tenant not found");
    }

    console.log("Found tenant:", tenant);

    // Determine recipient based on who sent the message
    let recipientEmail, recipientName;
    
    if (isFromTenant) {
      // Si le message vient du locataire, on doit notifier le propriétaire
      // Récupérer l'email du propriétaire associé à la propriété
      if (!tenant.property_id) {
        console.error("Property ID not found for tenant");
        throw new Error("Property ID not found for tenant");
      }
      
      const { data: property, error: propertyError } = await supabase
        .from("properties")
        .select("user_id")
        .eq("id", tenant.property_id)
        .single();
      
      if (propertyError || !property) {
        console.error("Error fetching property:", propertyError);
        throw new Error("Property not found");
      }
      
      // Récupérer l'email du propriétaire
      const { data: user, error: userError } = await supabase
        .from("profiles")
        .select("email, first_name, last_name")
        .eq("id", property.user_id)
        .single();
      
      if (userError || !user) {
        console.error("Error fetching property owner:", userError);
        throw new Error("Property owner not found");
      }
      
      recipientEmail = user.email;
      recipientName = `${user.first_name} ${user.last_name}`;
    } else {
      // Si le message vient du propriétaire, notifier le locataire
      recipientEmail = tenant.email;
      recipientName = tenant.name;
    }

    console.log("Sending notification to:", { recipientEmail, recipientName });

    // Envoyer une notification par email avec un design plus moderne
    const emailResponse = await resend.emails.send({
      from: "Property Management <onboarding@resend.dev>",
      to: [recipientEmail],
      subject: `New Message: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 10px; border: 1px solid #e0e0e0; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
          <div style="background-color: #7c3aed; padding: 15px; margin: -20px -20px 20px -20px; border-radius: 10px 10px 0 0;">
            <h2 style="color: white; margin: 0; font-weight: 500; text-align: center;">New Message Notification</h2>
          </div>
          
          <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
            Hello ${recipientName},
          </p>
          <p style="color: #444; line-height: 1.6; margin-bottom: 20px;">
            ${isFromTenant 
              ? 'You have received a new message from your tenant.' 
              : 'You have received a new message from your property manager.'}
          </p>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #7c3aed;">
            <h3 style="color: #7c3aed; margin-top: 0; margin-bottom: 10px; font-weight: 500;">Message Details:</h3>
            <p style="color: #333; margin-bottom: 10px;"><strong>Subject:</strong> ${subject}</p>
            <p style="color: #333; margin-bottom: 0;"><strong>Content:</strong><br>${content}</p>
          </div>
          
          <div style="margin: 30px 0; text-align: center;">
            <a href="${supabaseUrl.replace('.supabase.co', '')}/dashboard" style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: 500; display: inline-block;">View in Dashboard</a>
          </div>
          
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #888; font-size: 0.9em; text-align: center;">
            This is an automated message from your property management system. Please do not reply to this email.
          </p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    // Update the tenant_communications record to mark as notified
    const { error: updateError } = await supabase
      .from("tenant_communications")
      .update({ tenant_notified: true })
      .eq("tenant_id", tenantId)
      .eq("subject", subject)
      .is("tenant_notified", false);

    if (updateError) {
      console.error("Error updating communication record:", updateError);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in notify-communication function:", error);
    return new Response(
      JSON.stringify({ error: `Failed to send notification: ${error.message}` }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
