
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ShareDocumentRequest {
  recipientEmail: string;
  documentContent: string;
  documentTitle: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      recipientEmail, 
      documentContent, 
      documentTitle
    }: ShareDocumentRequest = await req.json();

    if (!recipientEmail || !documentContent || !documentTitle) {
      throw new Error("Missing required fields");
    }

    // Generate a basic HTML representation of the content
    const htmlContent = `<div style="white-space: pre-wrap; font-family: Arial, sans-serif;">${documentContent.replace(/\n/g, '<br/>')}</div>`;

    const emailResponse = await resend.emails.send({
      from: `Document Sharing <onboarding@resend.dev>`,
      to: [recipientEmail],
      subject: `Document shared with you: ${documentTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">${documentTitle}</h2>
          <p style="margin-bottom: 20px;">A document has been shared with you:</p>
          
          <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
            ${htmlContent}
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            This document was shared via our document sharing system.
          </p>
        </div>
      `,
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Document shared successfully",
        data: emailResponse 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in share-document function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to share document" 
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
};

serve(handler);
