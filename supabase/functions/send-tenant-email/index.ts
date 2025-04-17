
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
  console.log("Starting send-tenant-email function");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { tenantId, subject, content, category } = await req.json();
    
    console.log("Request data:", { tenantId, subject, content, category });

    if (!tenantId) {
      throw new Error("Missing tenant ID");
    }

    // Fetch tenant email
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

    // Send email
    const emailResponse = await resend.emails.send({
      from: "Property Management <onboarding@resend.dev>",
      to: [tenant.email],
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">${subject}</h2>
          <p style="color: #666; line-height: 1.6;">${content}</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #888; font-size: 0.9em;">
            This message was sent via our property management system.
          </p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    // Create communication record with status 'unread'
    const { data: commData, error: commError } = await supabase
      .from('tenant_communications')
      .insert({
        tenant_id: tenantId,
        type: 'email',
        subject: subject,
        content: content,
        category: category,
        status: 'unread',
        is_from_tenant: false
      })
      .select()
      .single();

    if (commError) {
      console.error("Database error:", commError);
      throw commError;
    }

    console.log("Communication record created:", commData);

    return new Response(JSON.stringify({ emailResponse, commData }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Error in send-tenant-email function:", error);
    return new Response(
      JSON.stringify({ error: `Failed to send email: ${JSON.stringify(error)}` }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
