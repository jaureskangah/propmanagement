
import { supabase } from "@/lib/supabase";

type DocumentType = 'lease' | 'receipt' | 'other';

interface UploadOptions {
  tenantId: string;
  file: File;
  category?: string;
  onProgress?: (progress: number) => void;
}

interface UploadResult {
  success: boolean;
  data?: any;
  error?: string;
  publicUrl?: string;
}

export const documentUploadService = {
  /**
   * Uploads a document to Supabase storage and creates a database record
   */
  async uploadDocument({ tenantId, file, category = 'other', onProgress }: UploadOptions): Promise<UploadResult> {
    if (!file || !tenantId) {
      console.error("Missing required parameters: file or tenantId");
      return { success: false, error: "Missing required parameters" };
    }

    try {
      // Check if the current user is authenticated
      const { data: userData, error: authError } = await supabase.auth.getUser();
      if (authError || !userData.user) {
        console.error("Authentication error:", authError);
        return { success: false, error: "authRequired" };
      }

      console.log("Current user:", userData.user.id);
      console.log("Attempting to upload document for tenant:", tenantId);
      
      // Create a unique filename with appropriate path structure
      const fileExt = file.name.split('.').pop();
      const fileName = `${tenantId}/${crypto.randomUUID()}.${fileExt}`;

      console.log("Uploading to storage with path:", fileName);

      // We'll skip the bucket existence check as we've already confirmed it exists in Supabase
      // and the client might not have permission to list buckets due to RLS

      // Upload the file directly
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('tenant_documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        
        if (uploadError.message?.includes("new row violates row-level security policy")) {
          return { 
            success: false, 
            error: "permissionDenied"
          };
        }
        
        if (uploadError.message?.includes("bucket_id") || uploadError.message?.includes("not found")) {
          console.error("Bucket not found:", uploadError);
          return { success: false, error: "storageBucketMissing" };
        }
        
        return { success: false, error: "uploadError" };
      }

      console.log("File uploaded successfully:", uploadData, "getting public URL");

      // Generate public URL
      const { data: publicUrlData } = await supabase.storage
        .from('tenant_documents')
        .getPublicUrl(fileName);

      if (!publicUrlData?.publicUrl) {
        console.error("Failed to generate public URL");
        return { success: false, error: "publicUrlError" };
      }

      console.log("Generated public URL:", publicUrlData.publicUrl);

      // Determine document type
      let document_type: DocumentType = 'other';
      if (category === 'lease') {
        document_type = 'lease';
      } else if (category === 'receipt') {
        document_type = 'receipt';
      }

      // Save document reference in database
      const { data: insertData, error: dbError } = await supabase
        .from('tenant_documents')
        .insert({
          tenant_id: tenantId,
          name: file.name,
          file_url: publicUrlData.publicUrl,
          document_type: document_type,
          category: category,
          uploaded_by: userData.user.id
        })
        .select();

      if (dbError) {
        console.error("Database insert error:", dbError);
        
        // Rollback file upload if possible
        try {
          await supabase.storage
            .from('tenant_documents')
            .remove([fileName]);
          console.log("Rollback: Deleted uploaded file due to database error");
        } catch (rollbackError) {
          console.error("Could not rollback file upload:", rollbackError);
        }
        
        if (dbError.message?.includes("violates row-level security policy")) {
          return { success: false, error: "permissionDenied" };
        }
        
        return { success: false, error: "databaseError" };
      }

      console.log("Document reference saved in database:", insertData);

      return { 
        success: true, 
        data: insertData, 
        publicUrl: publicUrlData.publicUrl 
      };
    } catch (error: any) {
      console.error('Upload error:', error);
      return {
        success: false,
        error: error.message || "Unknown error"
      };
    }
  }
};
