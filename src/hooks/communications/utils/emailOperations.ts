
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

/**
 * Utility function to send tenant email via Supabase Edge function
 */
export const sendTenantEmail = async (
  tenantId: string,
  subject: string,
  content: string,
  category: string = 'general'
) => {
  console.log("Sending email via Edge function for tenant:", tenantId);
  
  const response = await supabase.functions.invoke('send-tenant-email', {
    body: {
      tenantId,
      subject,
      content,
      category
    }
  });

  console.log("Edge function response:", response);

  if (response.error) {
    console.error("Edge function error:", response.error);
    throw new Error(response.error.message || "Error sending email");
  }

  return response;
};

/**
 * Create a communication record in the database
 */
export const createCommunicationRecord = async (
  tenantId: string,
  type: string,
  subject: string,
  content: string,
  category: string,
  status: string = 'unread'
) => {
  const { data, error } = await supabase
    .from('tenant_communications')
    .insert({
      tenant_id: tenantId,
      type,
      subject,
      content,
      category,
      status
    });

  if (error) {
    console.error("Database error:", error);
    throw error;
  }

  return data;
};
