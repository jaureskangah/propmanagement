
import { TenantDocument } from "@/types/tenant";
import { toast } from "@/hooks/use-toast";

/**
 * Downloads a document file with the proper MIME type
 */
export const downloadDocument = async (document: TenantDocument, t: (key: string) => string) => {
  if (!document || !document.file_url) return;
  
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
    const response = await fetch(document.file_url);
    
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    
    // Get the file as a blob with the correct MIME type
    const blob = await response.blob();
    const contentType = getContentType(document.name);
    const fileBlob = new Blob([blob], { type: contentType });
    
    // Create a download link and click it
    const downloadUrl = URL.createObjectURL(fileBlob);
    const link = window.document.createElement('a');
    link.href = downloadUrl;
    link.download = document.name;
    window.document.body.appendChild(link);
    link.click();
    
    // Clean up
    window.document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
    
    toast({
      title: t('downloadStarted'),
      description: t('downloadStartedDescription')
    });
  } catch (error) {
    console.error("Error downloading document:", error);
    toast({
      title: t("error"),
      description: t("uploadError"),
      variant: "destructive",
    });
  }
};

/**
 * Opens a document in a new browser tab
 */
export const openDocumentInNewTab = (fileUrl: string | undefined) => {
  if (!fileUrl) {
    console.error("Document URL is undefined, cannot open document");
    return;
  }
  
  // Add timestamp to URL to prevent caching issues
  const urlWithTimestamp = `${fileUrl}${fileUrl.includes('?') ? '&' : '?'}t=${Date.now()}`;
  console.log("Opening URL in new tab:", urlWithTimestamp);
  window.open(urlWithTimestamp, '_blank');
};
