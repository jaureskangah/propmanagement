
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export const useDocumentUpload = (tenantId: string, onUploadComplete: () => void) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const uploadDocument = async (file: File, documentType: 'lease' | 'receipt' | 'other' = 'other') => {
    if (!file) {
      console.log("No file selected");
      return;
    }

    setIsUploading(true);
    console.log("Starting upload for file:", file.name, "type:", documentType);

    try {
      // 1. Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${tenantId}/${crypto.randomUUID()}.${fileExt}`;

      console.log("Uploading to storage with path:", fileName);

      const { error: uploadError } = await supabase.storage
        .from('tenant_documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        if (uploadError.message.includes('does not exist')) {
          console.error("Bucket 'tenant_documents' does not exist:", uploadError);
          toast({
            title: "Erreur de configuration",
            description: "Le bucket de stockage n'existe pas. Veuillez contacter l'administrateur.",
            variant: "destructive",
          });
          setIsUploading(false);
          return;
        }
        throw uploadError;
      }

      console.log("File uploaded successfully, getting public URL");

      // 2. Generate public URL
      const { data: publicUrlData } = await supabase.storage
        .from('tenant_documents')
        .getPublicUrl(fileName);

      if (!publicUrlData?.publicUrl) {
        throw new Error("Failed to generate public URL");
      }

      console.log("Generated public URL:", publicUrlData.publicUrl);

      // 3. Save document reference with public URL in database
      const { data: insertData, error: dbError } = await supabase
        .from('tenant_documents')
        .insert({
          tenant_id: tenantId,
          name: file.name,
          file_url: publicUrlData.publicUrl,
          document_type: documentType
        })
        .select();

      if (dbError) {
        console.error("Database insert error:", dbError);
        throw dbError;
      }

      console.log("Document reference saved in database:", insertData);

      toast({
        title: "Document chargé",
        description: "Le document a été chargé avec succès",
      });

      onUploadComplete();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du chargement",
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
