
export const validateFile = (
  file: File, 
  options: { 
    maxSizeMB?: number, 
    allowedTypes?: string[] 
  } = {},
  showError?: (title: string, description: string, variant?: "default" | "destructive") => void
): boolean => {
  const maxSizeMB = options.maxSizeMB || 10; // Default 10MB
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  const allowedTypes = options.allowedTypes || [
    'application/pdf', 
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'text/plain'
  ];
  
  // Check file size
  if (file.size > maxSizeBytes) {
    console.error(`File too large: ${file.size} bytes. Max allowed: ${maxSizeBytes} bytes`);
    if (showError) {
      showError("error", "fileSizeLimit", "destructive");
    }
    return false;
  }
  
  // Check file type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    console.error(`Invalid file type: ${file.type}. Allowed types: ${allowedTypes.join(', ')}`);
    if (showError) {
      showError("error", "fileValidationError", "destructive");
    }
    return false;
  }
  
  return true;
};
