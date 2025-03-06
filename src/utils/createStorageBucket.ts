
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
        return false;
      }
      
      console.log("Successfully created tenant_documents bucket");
    } else {
      console.log("tenant_documents bucket already exists");
    }
    
    return true;
  } catch (error) {
    console.error("Error ensuring tenant_documents bucket:", error);
    return false;
  }
};
