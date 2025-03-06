
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useLocale } from "@/components/providers/LocaleProvider";

export const useDocumentUpload = (tenantId: string, onUploadComplete: () => void) => {
  const { toast } = useToast();
  const { t } = useLocale();
  const [isUploading, setIsUploading] = useState(false);

  const validateFile = (file: File): boolean => {
    // Vérifier la taille du fichier (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB en octets
    if (file.size > maxSize) {
      toast({
        title: t("error"),
        description: t("fileSizeLimit"),
        variant: "destructive",
      });
      return false;
    }

    // Vérifier le type de fichier
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png'
    ];
    
    const fileType = file.type;
    if (!allowedTypes.includes(fileType)) {
      // Vérification supplémentaire par extension
      const extension = file.name.split('.').pop()?.toLowerCase();
      const allowedExtensions = ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png'];
      
      if (!extension || !allowedExtensions.includes(extension)) {
        toast({
          title: t("error"),
          description: t("supportedFormats"),
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

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

    // Valider le fichier avant de commencer l'upload
    if (!validateFile(file)) {
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

      // 1. Créer un nom de fichier unique avec un UUID
      const fileExt = file.name.split('.').pop();
      const fileName = `${tenantId}/${crypto.randomUUID()}.${fileExt}`;

      console.log("Uploading to storage with path:", fileName);

      // 2. Upload du fichier - removed the signal from AbortController as it's not supported
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

      // 3. Générer l'URL publique
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

      // 4. Enregistrer la référence du document avec l'URL publique dans la base de données
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
      return insertData;
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
      
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    uploadDocument
  };
};
