
import { useToast } from "@/hooks/use-toast";

interface ValidationOptions {
  maxSize?: number;
  allowedTypes?: string[];
  allowedExtensions?: string[];
}

export const validateFile = (
  file: File, 
  options: ValidationOptions = {}, 
  showToast: (title: string, description: string, variant?: "default" | "destructive") => void
): boolean => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png'
    ],
    allowedExtensions = ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png']
  } = options;

  // Check file size
  if (file.size > maxSize) {
    showToast(
      "Error",
      "Maximum file size: 10MB",
      "destructive"
    );
    return false;
  }

  // Check file type
  const fileType = file.type;
  if (!allowedTypes.includes(fileType)) {
    // Additional check by extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (!extension || !allowedExtensions.includes(extension)) {
      showToast(
        "Error",
        "Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG",
        "destructive"
      );
      return false;
    }
  }

  return true;
};
