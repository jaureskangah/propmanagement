
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactRequest {
  name: string;
  email: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, message }: ContactRequest = await req.json();

    // Store message in database
    const { error: dbError } = await supabase
      .from("contact_messages")
      .insert([{ name, email, message }]);

    if (dbError) throw dbError;

    // Send confirmation email to user
    const { data: userEmailData, error: userEmailError } = await resend.emails.send({
      from: "PropManagement <contact@propmanagement.app>",
      to: [email],
      subject: "We received your message!",
      html: `
        <h1>Thank you for contacting us, ${name}!</h1>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <p>Best regards,<br>The PropManagement Team</p>
      `,
    });

    if (userEmailError) throw userEmailError;

    // Send notification to admin
    const { data: adminEmailData, error: adminEmailError } = await resend.emails.send({
      from: "PropManagement <contact@propmanagement.app>",
      to: ["contact@propmanagement.app"],
      subject: "New Contact Form Submission",
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    if (adminEmailError) throw adminEmailError;

    // Update message status to sent
    const { error: updateError } = await supabase
      .from("contact_messages")
      .update({ status: "sent" })
      .eq("email", email)
      .eq("created_at", new Date().toISOString());

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ message: "Message sent successfully" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
