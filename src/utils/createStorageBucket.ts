
import { supabase } from "@/lib/supabase";

/**
 * Creates the tenant_documents bucket if it doesn't exist
 * This function can be called on application initialization
 */
export const ensureTenantDocumentsBucket = async () => {
  try {
    // Check if the bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error("Error checking buckets:", bucketsError);
      
      // If the error is related to permissions, we'll show a specific message
      if (bucketsError.message?.includes("not authorized") || bucketsError.message?.includes("permission denied")) {
        console.warn("Permission denied when checking buckets. This might be due to RLS policies.");
        // Let's attempt to use the bucket directly instead of trying to create it
        return true;
      }
      
      return false;
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === 'tenant_documents');
    
    if (!bucketExists) {
      console.log("Creating tenant_documents bucket");
      const { error: createError } = await supabase.storage.createBucket('tenant_documents', {
        public: true, // Make the bucket public
      });
      
      if (createError) {
        console.error("Error creating bucket:", createError);
        
        // If the bucket already exists but we couldn't see it due to RLS
        if (createError.message?.includes("already exists")) {
          console.log("Bucket already exists but was not visible due to RLS policies.");
          return true;
        }
        
        // Check if it's a permissions error
        if (createError.message?.includes("not authorized") || createError.message?.includes("permission denied")) {
          console.warn("Permission denied when creating bucket. This might be due to RLS policies.");
          // We'll assume the bucket exists and is properly configured on the server
          return true;
        }
        
        return false;
      }
      
      console.log("Successfully created tenant_documents bucket");
    } else {
      console.log("tenant_documents bucket already exists");
    }
    
    // Test if we can upload to the bucket (to verify permissions)
    const testFilePath = `__test__/test-${Date.now()}.txt`;
    const { error: uploadError } = await supabase.storage
      .from('tenant_documents')
      .upload(testFilePath, new Blob(['test']), {
        cacheControl: '3600',
        upsert: true
      });
      
    if (uploadError) {
      console.warn("Could not upload a test file to bucket:", uploadError.message);
      
      if (uploadError.message?.includes("not authorized") || 
          uploadError.message?.includes("permission denied") ||
          uploadError.message?.includes("row-level security policy")) {
        console.warn("The bucket exists but user doesn't have permission to upload. This might be handled by RLS policies.");
      }
    } else {
      // Clean up the test file
      await supabase.storage
        .from('tenant_documents')
        .remove([testFilePath]);
      console.log("Successfully verified upload permissions to the bucket");
    }
    
    return true;
  } catch (error) {
    console.error("Error ensuring tenant_documents bucket:", error);
    return false;
  }
};
