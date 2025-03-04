
import { FileText, File, FileImage } from "lucide-react";
import { TenantDocument } from "@/types/tenant";

interface DocumentIconProps {
  document: TenantDocument;
}

export const DocumentIcon = ({ document }: DocumentIconProps) => {
  const lowerName = (document?.name || '').toLowerCase();
  
  // First check document_type
  if (document?.document_type === 'lease') {
    return <FileText className="h-5 w-5 text-blue-500" />;
  } else if (document?.document_type === 'receipt') {
    return <FileText className="h-5 w-5 text-green-500" />;
  }
  
  // Fallback to file extension
  if (lowerName.endsWith('.pdf')) {
    return <File className="h-5 w-5 text-red-500" />;
  } else if (lowerName.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
    return <FileImage className="h-5 w-5 text-blue-500" />;
  } else {
    return <FileText className="h-5 w-5 text-gray-500" />;
  }
};
