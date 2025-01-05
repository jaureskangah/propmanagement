import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
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

    if (!res.ok) {
      const error = await res.text();
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }

    console.log("Email sent successfully");

    // Store communication in database
    const { error: commError } = await supabase
      .from("tenant_communications")
      .insert({
        tenant_id: emailRequest.tenantId,
        type: "email",
        subject: emailRequest.subject,
        content: emailRequest.content,
        category: emailRequest.category,
        status: "sent"
      });

    if (commError) {
      console.error("Error storing communication:", commError);
      throw new Error("Failed to store communication");
    }

    console.log("Communication stored successfully");

    return new Response(
      JSON.stringify({ message: "Email sent successfully" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

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