import { supabase } from "@/lib/supabase";
import type { Tenant } from "@/types/tenant";

export const uploadDocumentToStorage = async (
  file: File | Blob,
  tenant: Tenant,
  filePath: string
) => {
  // Get current user for scoped folder structure
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Not authenticated");
  
  const normalizedPath = `${userData.user.id}/tenant-documents/${tenant.id}/${filePath}`;
  console.log("Uploading file to path:", normalizedPath);
  console.log("File type:", file.type);
  console.log("File size:", file.size);

  // Si le fichier est déjà un Blob PDF, l'utiliser directement
  const pdfBlob = file instanceof Blob ? file : new Blob([file], { 
    type: 'application/pdf'
  });

  const { error: uploadError, data } = await supabase.storage
    .from('tenant_documents')
    .upload(normalizedPath, pdfBlob, {
      contentType: 'application/pdf',
      cacheControl: '3600',
      upsert: true
    });

  if (uploadError) {
    console.error('Upload error:', uploadError);
    throw uploadError;
  }

  console.log("File uploaded successfully");

  const { error: dbError } = await supabase
    .from('tenant_documents')
    .insert({
      tenant_id: tenant.id,
      name: normalizedPath.split('/').pop() || 'document.pdf',
      file_url: normalizedPath // Store path instead of signed URL
    });

  if (dbError) {
    console.error('Database error:', dbError);
    throw dbError;
  }

  return normalizedPath;
};

export const generateFileName = (template: string, tenant: Tenant): string => {
  const timestamp = new Date().getTime();
  const sanitizedName = tenant.name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '_');
  
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