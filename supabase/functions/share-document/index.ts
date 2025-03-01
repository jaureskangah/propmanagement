
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ShareDocumentRequest {
  documentId: string;
  documentName: string;
  documentUrl: string;
  documentType: string;
  recipients: string[];
  message: string;
  senderEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      documentId, 
      documentName, 
      documentUrl, 
      documentType,
      recipients, 
      message, 
      senderEmail 
    }: ShareDocumentRequest = await req.json();

    console.log("Received share document request:", {
      documentId,
      documentName,
      recipients,
      senderEmail
    });

    if (!documentId || !documentName || !documentUrl || !recipients.length || !senderEmail) {
      throw new Error("Missing required fields");
    }

    // Send email to each recipient
    const emailPromises = recipients.map(async (recipient) => {
      try {
        const documentTypeText = documentType === 'lease' ? 'Lease Agreement' : 
                                documentType === 'receipt' ? 'Payment Receipt' : 
                                'Document';

        const emailResponse = await resend.emails.send({
          from: `Document Sharing <onboarding@resend.dev>`,
          to: [recipient],
          subject: `${senderEmail} shared a ${documentTypeText} with you: ${documentName}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #4f46e5;">${senderEmail} shared a document with you</h2>
              <div style="border-left: 4px solid #4f46e5; padding-left: 20px; margin: 20px 0; color: #666;">
                <p style="font-size: 16px; font-weight: bold;">${documentName}</p>
                <p style="font-size: 14px; color: #666;">Document type: ${documentTypeText}</p>
                ${message ? `<p style="font-style: italic; margin-top: 15px;">"${message}"</p>` : ''}
              </div>
              <div style="margin: 30px 0;">
                <a href="${documentUrl}" style="background-color: #4f46e5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                  View Document
                </a>
              </div>
              <p style="color: #666; font-size: 13px; margin-top: 40px;">
                This is an automated email sent from our document sharing system. 
                If you weren't expecting this document, please contact the sender.
              </p>
            </div>
          `,
        });

        console.log(`Email sent to ${recipient}:`, emailResponse);
        return emailResponse;
      } catch (error) {
        console.error(`Failed to send email to ${recipient}:`, error);
        throw error;
      }
    });

    // Wait for all emails to be sent
    await Promise.all(emailPromises);

    // Record share activity in the database if needed
    // This could be implemented to track share history

    return new Response(
      JSON.stringify({ success: true, message: "Documents shared successfully" }),
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
