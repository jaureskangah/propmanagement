import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  tenantId: string;
  subject: string;
  content: string;
  category: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Handling email request");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      console.error("Missing RESEND_API_KEY");
      throw new Error("Missing RESEND_API_KEY");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const emailRequest: EmailRequest = await req.json();
    console.log("Email request received:", emailRequest);

    // Get tenant email
    const { data: tenant, error: tenantError } = await supabase
      .from("tenants")
      .select("email, name")
      .eq("id", emailRequest.tenantId)
      .single();

    if (tenantError || !tenant) {
      console.error("Error fetching tenant:", tenantError);
      throw new Error("Tenant not found");
    }

    console.log("Sending email to tenant:", tenant.email);

    // Send email using Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Property Manager <onboarding@resend.dev>",
        to: [tenant.email],
        subject: emailRequest.subject,
        html: `<div>
          <p>Hello ${tenant.name},</p>
          <p>${emailRequest.content}</p>
          <p>Best regards,<br/>Your Property Manager</p>
        </div>`,
      }),
    });

    const resendResponse = await res.json();
    console.log("Resend API response:", resendResponse);

    if (!res.ok) {
      console.error("Error from Resend API:", resendResponse);
      throw new Error(`Failed to send email: ${JSON.stringify(resendResponse)}`);
    }

    console.log("Email sent successfully");

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in send-tenant-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
};

serve(handler);