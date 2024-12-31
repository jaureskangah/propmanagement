import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export const useDocumentUpload = (tenantId: string, onUploadComplete: () => void) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const uploadDocument = async (file: File) => {
    if (!file) {
      console.log("No file selected");
      return;
    }

    setIsUploading(true);
    console.log("Starting upload for file:", file.name);

    try {
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
        console.error("Storage upload error:", uploadError);
        throw uploadError;
      }

      console.log("File uploaded successfully, getting public URL");

      const { data: { publicUrl } } = supabase.storage
        .from('tenant_documents')
        .getPublicUrl(fileName);

      console.log("Generated public URL:", publicUrl);

      const { error: dbError } = await supabase
        .from('tenant_documents')
        .insert({
          tenant_id: tenantId,
          name: file.name,
          file_url: publicUrl
        });

      if (dbError) {
        console.error("Database insert error:", dbError);
        throw dbError;
      }

      console.log("Document reference saved in database with URL:", publicUrl);

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