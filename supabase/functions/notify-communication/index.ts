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

interface NotificationRequest {
  tenantId: string;
  subject: string;
  content: string;
  isFromTenant: boolean;
}

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
    const { tenantId, subject, content, isFromTenant }: NotificationRequest = await req.json();
    
    console.log("Request data:", { tenantId, subject, isFromTenant });

    // Fetch tenant and owner information
    const { data: tenant, error: tenantError } = await supabase
      .from("tenants")
      .select(`
        email,
        name,
        user_id,
        property_id
      `)
      .eq("id", tenantId)
      .single();

    if (tenantError || !tenant) {
      console.error("Error fetching tenant:", tenantError);
      throw new Error("Tenant not found");
    }

    // Get owner's email from profiles using user_id
    const { data: owner, error: ownerError } = await supabase
      .from("profiles")
      .select("email, first_name, last_name")
      .eq("id", tenant.user_id)
      .single();

    if (ownerError || !owner) {
      console.error("Error fetching owner:", ownerError);
      throw new Error("Owner not found");
    }

    console.log("Found tenant and owner:", { tenant, owner });

    // Send email to the recipient (owner if from tenant, tenant if from owner)
    const recipientEmail = isFromTenant ? owner.email : tenant.email;
    const senderName = isFromTenant 
      ? tenant.name 
      : `${owner.first_name} ${owner.last_name}`;
    const recipientName = isFromTenant 
      ? `${owner.first_name} ${owner.last_name}`
      : tenant.name;
    
    const emailResponse = await resend.emails.send({
      from: "Property Management <onboarding@resend.dev>",
      to: [recipientEmail],
      subject: `New Message: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Message Received</h2>
          <p style="color: #666;">Dear ${recipientName},</p>
          <p style="color: #666;">You have received a new message from ${senderName}:</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
            <h3 style="color: #333; margin-top: 0;">${subject}</h3>
            <p style="color: #666; white-space: pre-wrap;">${content}</p>
          </div>
          <p style="color: #888; font-size: 0.9em; margin-top: 20px;">
            This is an automated notification from your property management system.
          </p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in notify-communication function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);