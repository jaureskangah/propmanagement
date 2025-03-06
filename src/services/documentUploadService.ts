
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
  error?: any;
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
      // Check if current user is authenticated
      const { data: userData, error: authError } = await supabase.auth.getUser();
      if (authError || !userData.user) {
        console.error("Authentication error:", authError);
        throw new Error("You must be logged in to upload documents");
      }

      console.log("Current user:", userData.user.id);
      console.log("Attempting to upload document for tenant:", tenantId);
      
      // Create unique filename with proper path structure
      const fileExt = file.name.split('.').pop();
      const fileName = `${tenantId}/${crypto.randomUUID()}.${fileExt}`;

      console.log("Uploading to storage with path:", fileName);

      // Upload file
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('tenant_documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      console.log("File uploaded successfully:", uploadData, "getting public URL");

      // Generate public URL
      const { data: publicUrlData } = await supabase.storage
        .from('tenant_documents')
        .getPublicUrl(fileName);

      if (!publicUrlData?.publicUrl) {
        console.error("Failed to generate public URL");
        throw new Error("Failed to generate public URL");
      }

      console.log("Generated public URL:", publicUrlData.publicUrl);

      // Determine document type
      let document_type: DocumentType = 'other';
      if (category === 'lease') {
        document_type = 'lease';
      } else if (category === 'receipt') {
        document_type = 'receipt';
      }

      // Save document reference to database with additional column for category and document_type
      const { data: insertData, error: dbError } = await supabase
        .from('tenant_documents')
        .insert({
          tenant_id: tenantId,
          name: file.name,
          file_url: publicUrlData.publicUrl,
          document_type: document_type,
          category: category
        })
        .select();

      if (dbError) {
        console.error("Database insert error:", dbError);
        // Rollback the file upload if possible
        try {
          await supabase.storage
            .from('tenant_documents')
            .remove([fileName]);
          console.log("Rollback: Deleted uploaded file due to database error");
        } catch (rollbackError) {
          console.error("Could not rollback file upload:", rollbackError);
        }
        throw dbError;
      }

      console.log("Document reference saved in database:", insertData);

      return { 
        success: true, 
        data: insertData, 
        publicUrl: publicUrlData.publicUrl 
      };
    } catch (error: any) {
      console.error('Upload error:', error);
      
      let errorMessage = "An error occurred during upload";
      
      if (error.message) {
        if (error.message.includes("duplicate key")) {
          errorMessage = "A document with this name already exists";
        } else if (error.message.includes("storage")) {
          errorMessage = "Storage error: " + error.message;
        } else if (error.message.includes("violates row-level security")) {
          errorMessage = "Permission error: You don't have access to upload documents";
        } else {
          errorMessage = "Error: " + error.message;
        }
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }
};
