
/**
 * Génère une URL directe vers un fichier dans Supabase Storage
 */
export const getStorageUrl = (tenantId: string, fileName: string): string => {
  // Encoder correctement le nom du fichier pour l'URL
  const encodedFileName = encodeURIComponent(fileName);
  return `https://jhjhzwbvmkurwfohjxlu.supabase.co/storage/v1/object/public/tenant_documents/${tenantId}/${encodedFileName}`;
};

/**
 * S'assure qu'un document a une URL valide
 */
export const ensureDocumentUrl = (document: TenantDocument): TenantDocument => {
  if (!document.file_url) {
    document.file_url = getStorageUrl(document.tenant_id || '', document.name);
    console.log(`URL générée pour le document ${document.id}: ${document.file_url}`);
  }
  return document;
};

// Import du type TenantDocument
import { TenantDocument } from "@/types/tenant";
