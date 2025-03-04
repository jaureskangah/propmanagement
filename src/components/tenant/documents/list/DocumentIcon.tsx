
import { FileText, FileSpreadsheet, FileImage, File } from "lucide-react";

interface DocumentIconProps {
  documentType?: string | null;
}

export const DocumentIcon = ({ documentType }: DocumentIconProps) => {
  switch (documentType) {
    case 'lease':
      return <FileText className="h-5 w-5 text-blue-500" />;
    case 'receipt':
      return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
    case 'image':
      return <FileImage className="h-5 w-5 text-purple-500" />;
    default:
      return <File className="h-5 w-5 text-gray-500" />;
  }
};
