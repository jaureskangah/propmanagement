
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useLocale } from "@/components/providers/LocaleProvider";

export const useDocumentUpload = (tenantId: string, onUploadComplete: () => void) => {
  const { toast } = useToast();
  const { t } = useLocale();
  const [isUploading, setIsUploading] = useState(false);

  const uploadDocument = async (
    file: File, 
    category: string = 'other'
  ) => {
    if (!file) {
      console.log("No file selected");
      return;
    }

    if (!tenantId) {
      console.error("No tenant ID provided");
      toast({
        title: t("error"),
        description: t("error"),
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    console.log("Starting upload for file:", file.name, "category:", category, "for tenant:", tenantId);

    try {
      // Vérifier si le bucket existe
      const { data: buckets, error: bucketsError } = await supabase
        .storage
        .listBuckets();
      
      console.log("Available storage buckets:", buckets?.map(b => b.name));
      
      if (bucketsError) {
        console.error("Error checking buckets:", bucketsError);
        throw bucketsError;
      }
      
      const bucketExists = buckets?.some(b => b.name === 'tenant_documents');
      
      if (!bucketExists) {
        console.log("Creating tenant_documents bucket");
        const { error: createBucketError } = await supabase
          .storage
          .createBucket('tenant_documents', { public: true });
          
        if (createBucketError) {
          console.error("Error creating bucket:", createBucketError);
          throw createBucketError;
        }
      }

      // 1. Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${tenantId}/${crypto.randomUUID()}.${fileExt}`;

      console.log("Uploading to storage with path:", fileName);

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

      // 2. Generate public URL
      const { data: publicUrlData } = await supabase.storage
        .from('tenant_documents')
        .getPublicUrl(fileName);

      if (!publicUrlData?.publicUrl) {
        console.error("Failed to generate public URL");
        throw new Error("Failed to generate public URL");
      }

      console.log("Generated public URL:", publicUrlData.publicUrl);

      // Déterminer le document_type en fonction de la catégorie
      let document_type: 'lease' | 'receipt' | 'other' = 'other';
      if (category === 'lease') {
        document_type = 'lease';
      } else if (category === 'receipt') {
        document_type = 'receipt';
      }

      // 3. Save document reference with public URL in database
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
        throw dbError;
      }

      console.log("Document reference saved in database:", insertData);

      toast({
        title: t("success"),
        description: t("docUploadSuccess"),
      });

      onUploadComplete();
    } catch (error: any) {
      console.error('Upload error:', error);
      
      let errorMessage = t("error");
      
      if (error.message) {
        if (error.message.includes("duplicate key")) {
          errorMessage = "Un document avec ce nom existe déjà";
        } else if (error.message.includes("storage")) {
          errorMessage = "Erreur de stockage: " + error.message;
        } else {
          errorMessage = "Erreur: " + error.message;
        }
      }
      
      toast({
        title: t("error"),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    uploadDocument
  };
};
