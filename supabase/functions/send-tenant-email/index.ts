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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { tenantId, subject, content, category } = await req.json() as EmailRequest;

    // Get tenant email
    const { data: tenant, error: tenantError } = await supabase
      .from("tenants")
      .select("email, name")
      .eq("id", tenantId)
      .single();

    if (tenantError || !tenant) {
      console.error("Error fetching tenant:", tenantError);
      return new Response(
        JSON.stringify({ error: "Tenant not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send email using Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      },
      body: JSON.stringify({
        from: "Property Manager <onboarding@resend.dev>",
        to: [tenant.email],
        subject: subject,
        html: `<div>
          <p>Hello ${tenant.name},</p>
          <p>${content}</p>
          <p>Best regards,<br/>Your Property Manager</p>
        </div>`,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }

    // Store communication in database
    const { error: commError } = await supabase
      .from("tenant_communications")
      .insert({
        tenant_id: tenantId,
        subject,
        content,
        category,
        type: "email",
        status: "sent"
      });

    if (commError) {
      console.error("Error storing communication:", commError);
      throw new Error("Failed to store communication");
    }

    return new Response(
      JSON.stringify({ message: "Email sent successfully" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in send-tenant-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);