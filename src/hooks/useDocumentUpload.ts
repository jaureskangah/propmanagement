
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/components/providers/LocaleProvider";
import { validateFile } from "@/utils/fileValidation";
import { documentUploadService } from "@/services/documentUploadService";
import { useAuth } from "@/components/AuthProvider";

export const useDocumentUpload = (tenantId: string, onUploadComplete: () => void) => {
  const { toast } = useToast();
  const { t } = useLocale();
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();

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

    if (!user) {
      console.error("User not authenticated");
      showToastMessage("error", "authRequired", "destructive");
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
        // Handle specific error messages
        let errorKey = "error";
        
        if (result.error === "authRequired") {
          errorKey = "authRequired";
        } else if (result.error === "permissionDenied") {
          errorKey = "permissionError";
        } else if (result.error === "storageBucketMissing") {
          errorKey = "storageBucketMissing";
        } else if (result.error === "uploadError") {
          errorKey = "uploadError";
        } else if (result.error === "databaseError") {
          errorKey = "databaseError";
        } else if (result.error === "publicUrlError") {
          errorKey = "publicUrlError";
        }
        
        showToastMessage("error", errorKey, "destructive");
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      
      // If not already handled above, show generic error
      if (!error.message?.includes("authRequired") && 
          !error.message?.includes("permissionDenied") &&
          !error.message?.includes("storageBucketMissing") &&
          !error.message?.includes("uploadError") &&
          !error.message?.includes("databaseError") &&
          !error.message?.includes("publicUrlError")) {
        showToastMessage("error", "uploadFailed", "destructive");
      }
      
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
