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
      .select("email, name")
      .eq("id", tenantId)
      .single();

    if (tenantError || !tenant) {
      console.error("Error fetching tenant:", tenantError);
      throw new Error("Tenant not found");
    }

    console.log("Found tenant:", tenant);

    // Determine recipient based on who sent the message
    const recipientEmail = tenant.email;
    const recipientName = tenant.name;

    // Send email notification
    const emailResponse = await resend.emails.send({
      from: "Property Management <onboarding@resend.dev>",
      to: [recipientEmail],
      subject: `New Message: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Hello ${recipientName},</h2>
          <p style="color: #666; line-height: 1.6;">
            ${isFromTenant ? 'Your message has been sent to the property manager.' : 'You have received a new message from your property manager.'}
          </p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Message Details:</h3>
            <p style="color: #666;"><strong>Subject:</strong> ${subject}</p>
            <p style="color: #666;"><strong>Content:</strong><br>${content}</p>
          </div>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #888; font-size: 0.9em;">
            This is an automated message from your property management system.
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