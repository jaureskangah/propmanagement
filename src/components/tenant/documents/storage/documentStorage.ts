import { supabase } from "@/lib/supabase";
import type { Tenant } from "@/types/tenant";

export const uploadDocumentToStorage = async (
  file: File | Blob,
  tenant: Tenant,
  filePath: string
) => {
  console.log("Uploading file to path:", filePath);
  console.log("File type:", file.type);
  console.log("File size:", file.size);

  // Ensure we're handling the file as a proper PDF
  const pdfFile = file instanceof File ? file : new File([file], filePath, { type: 'application/pdf' });

  const { error: uploadError, data } = await supabase.storage
    .from('tenant_documents')
    .upload(filePath, pdfFile, {
      contentType: 'application/pdf',
      cacheControl: '3600',
      upsert: true
    });

  if (uploadError) {
    console.error('Upload error:', uploadError);
    throw uploadError;
  }

  console.log("File uploaded successfully, getting public URL");
  const { data: { publicUrl } } = supabase.storage
    .from('tenant_documents')
    .getPublicUrl(filePath);

  console.log("Public URL generated:", publicUrl);

  const { error: dbError } = await supabase
    .from('tenant_documents')
    .insert({
      tenant_id: tenant.id,
      name: filePath.split('/').pop() || 'document.pdf',
      file_url: publicUrl
    });

  if (dbError) {
    console.error('Database error:', dbError);
    throw dbError;
  }

  return publicUrl;
};

export const generateFileName = (template: string, tenant: Tenant): string => {
  const timestamp = new Date().getTime();
  const sanitizedName = tenant.name.toLowerCase().replace(/\s+/g, '_');
  
  switch (template) {
    case 'lease':
      return `lease_agreement_${sanitizedName}_${timestamp}.pdf`;
    case 'receipt':
      return `rent_receipt_${sanitizedName}_${timestamp}.pdf`;
    case 'notice':
      return `notice_${sanitizedName}_${timestamp}.pdf`;
    default:
      return `document_${sanitizedName}_${timestamp}.pdf`;
  }
};