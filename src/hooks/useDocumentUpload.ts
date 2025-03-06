
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/components/providers/LocaleProvider";
import { validateFile } from "@/utils/fileValidation";
import { documentUploadService } from "@/services/documentUploadService";

export const useDocumentUpload = (tenantId: string, onUploadComplete: () => void) => {
  const { toast } = useToast();
  const { t } = useLocale();
  const [isUploading, setIsUploading] = useState(false);

  // Helper function to show toast messages
  const showToastMessage = (title: string, description: string, variant: "default" | "destructive" = "default") => {
    toast({
      title: t(title),
      description: t(description),
      variant,
    });
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
      showToastMessage("error", "tenantProfileNotFound", "destructive");
      return;
    }

    // Validate the file
    if (!validateFile(file, {}, (title, description, variant) => 
      showToastMessage(title, description, variant)
    )) {
      return;
    }

    setIsUploading(true);
    console.log("Starting upload for file:", file.name, "category:", category, "for tenant:", tenantId);

    try {
      // Use the upload service
      const result = await documentUploadService.uploadDocument({
        tenantId,
        file,
        category
      });

      if (result.success) {
        showToastMessage("success", "docUploadSuccess");
        onUploadComplete();
        return result.data;
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      
      let errorMessage = t("error");
      
      if (error.message) {
        if (error.message.includes("Permission error")) {
          errorMessage = t("permissionError") + ": " + error.message;
        } else {
          errorMessage = error.message;
        }
      }
      
      showToastMessage("error", errorMessage, "destructive");
      
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
