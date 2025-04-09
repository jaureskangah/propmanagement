
import { supabase } from "@/lib/supabase";
import { ToastAction } from "@/components/ui/toast";

export const downloadDocument = async (url: string | undefined | null, filename: string, t: (key: string) => string) => {
  console.log("Downloading document:", filename, "from URL:", url);
  
  if (!url) {
    console.error("URL is undefined or null, cannot download document");
    return {
      title: t("error") || "Error",
      description: t("fileNotFound") || "File not found",
      variant: "destructive" as const
    };
  }
  
  try {
    // Determine the MIME type based on file extension
    const getContentType = (fileName: string) => {
      const extension = fileName.split('.').pop()?.toLowerCase() || '';
      const mimeTypes: {[key: string]: string} = {
        'pdf': 'application/pdf',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'doc': 'application/msword',
      };
      return mimeTypes[extension] || 'application/octet-stream';
    };
    
    // Use direct fetch to get the file with correct content type
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    
    // Get the file as a blob with the correct MIME type
    const blob = await response.blob();
    const contentType = getContentType(filename);
    const fileBlob = new Blob([blob], { type: contentType });
    
    // Create a download link and click it
    const downloadUrl = URL.createObjectURL(fileBlob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
    
    return {
      title: t('downloadStarted') || "Download started",
      description: t('downloadStartedDescription') || "Your document will be downloaded shortly"
    };
  } catch (error) {
    console.error("Error downloading document:", error);
    return {
      title: t("error") || "Error",
      description: t("uploadError") || "An error occurred while downloading the document",
      variant: "destructive" as const
    };
  }
};

export const openDocumentInNewTab = (url: string | undefined | null, t: (key: string) => string) => {
  // Ensure we're logging the exact value
  console.log("Opening document in new tab. Exact URL value:", JSON.stringify(url));
  
  // Check if url is null, undefined, or an empty string
  if (!url) {
    console.error("URL is undefined or null, cannot open document");
    return {
      title: t("error") || "Error",
      description: t("fileNotFound") || "File not found",
      variant: "destructive" as const
    };
  }
  
  try {
    // Add timestamp to prevent caching issues
    const urlWithTimestamp = `${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`;
    console.log("Opening URL in new tab:", urlWithTimestamp);
    window.open(urlWithTimestamp, '_blank');
    return null; // No toast message needed on success
  } catch (error) {
    console.error("Error opening document in new tab:", error);
    return {
      title: t("error") || "Error",
      description: t("browserOpenError") || "An error occurred while opening the document",
      variant: "destructive" as const
    };
  }
};

export const deleteDocument = async (documentId: string, onSuccess: () => void, t: (key: string) => string) => {
  try {
    console.log("Deleting document:", documentId);

    const { error } = await supabase
      .from('tenant_documents')
      .delete()
      .eq('id', documentId);

    if (error) {
      console.error("Error deleting document:", error);
      throw error;
    }

    onSuccess();
    
    return {
      title: t("documentDeleted") || "Document deleted",
      description: t("docDeleteSuccess") || "The document has been successfully deleted",
    };
  } catch (error) {
    console.error('Delete error:', error);
    return {
      title: t("error") || "Error",
      description: t("uploadError") || "An error occurred while deleting the document",
      variant: "destructive" as const
    };
  }
};
