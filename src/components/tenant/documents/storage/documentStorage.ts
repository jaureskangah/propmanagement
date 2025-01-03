import { supabase } from "@/lib/supabase";
import type { Tenant } from "@/types/tenant";

export const uploadDocumentToStorage = async (
  file: File,
  tenant: Tenant,
  filePath: string
) => {
  console.log("Uploading file to path:", filePath);

  const { error: uploadError, data } = await supabase.storage
    .from('tenant_documents')
    .upload(filePath, file, {
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
      name: file.name,
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
  return template === 'lease'
    ? `contrat_location_${tenant.name.toLowerCase().replace(/\s+/g, '_')}_${timestamp}.pdf`
    : `recu_loyer_${tenant.name.toLowerCase().replace(/\s+/g, '_')}_${timestamp}.pdf`;
};