
import { FileText, FileSpreadsheet, FileImage, File, FileCode, FileCog, FileJson } from "lucide-react";
import { TenantDocument } from "@/types/tenant";

interface DocumentIconProps {
  documentType?: string | null;
  document?: TenantDocument;
}

export const DocumentIcon = ({ documentType, document }: DocumentIconProps) => {
  // If a document object is provided, use its document_type
  const type = document?.document_type || documentType;
  
  switch (type) {
    case 'lease':
      return <FileText className="h-5 w-5 text-blue-500" />;
    case 'receipt':
      return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
    case 'image':
      return <FileImage className="h-5 w-5 text-purple-500" />;
    case 'contract':
      return <FileText className="h-5 w-5 text-orange-500" />;
    case 'invoice':
      return <FileSpreadsheet className="h-5 w-5 text-teal-500" />;
    case 'report':
      return <FileJson className="h-5 w-5 text-pink-500" />;
    case 'technical':
      return <FileCog className="h-5 w-5 text-cyan-500" />;
    case 'code':
      return <FileCode className="h-5 w-5 text-indigo-500" />;
    default:
      return <File className="h-5 w-5 text-gray-500" />;
  }
};
