
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendDocumentRequest {
  tenantId: string;
  fileName: string;
  fileUrl: string;
  documentType: string;
  category: string;
  senderName: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the request body
    const { 
      tenantId, 
      fileName, 
      fileUrl, 
      documentType,
      category, 
      senderName
    }: SendDocumentRequest = await req.json();

    console.log("Received send document request:", {
      tenantId,
      fileName,
      documentType,
      category,
      senderName
    });

    if (!tenantId || !fileName || !fileUrl) {
      throw new Error("Missing required fields");
    }

    // Create a Supabase client with the Supabase URL and key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Determine document type
    let finalDocumentType = documentType || 'other';
    if (category === 'lease') {
      finalDocumentType = 'lease';
    } else if (category === 'receipt') {
      finalDocumentType = 'receipt';
    }
    
    // Save document reference in database
    const { data: insertData, error: dbError } = await supabaseAdmin
      .from('tenant_documents')
      .insert({
        tenant_id: tenantId,
        name: fileName,
        file_url: fileUrl,
        document_type: finalDocumentType,
        category: category || finalDocumentType,
        source: 'landlord',
        sender_name: senderName
      })
      .select();

    if (dbError) {
      console.error("Database insert error:", dbError);
      throw new Error("Failed to save document in database");
    }

    console.log("Document reference saved in database:", insertData);

    // Send notification to the tenant (optional - could be added later)
    // This would require an additional notification system

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Document sent successfully",
        data: insertData
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
    console.error("Error in send-tenant-document function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to send document" 
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
