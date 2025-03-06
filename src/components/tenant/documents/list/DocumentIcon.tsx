
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
      return <FileText color="#3B82F6" className="h-5 w-5" />; // blue-500
    case 'receipt':
      return <FileSpreadsheet color="#10B981" className="h-5 w-5" />; // green-500
    case 'image':
      return <FileImage color="#8B5CF6" className="h-5 w-5" />; // purple-500
    case 'contract':
      return <FileText color="#F97316" className="h-5 w-5" />; // orange-500
    case 'invoice':
      return <FileSpreadsheet color="#14B8A6" className="h-5 w-5" />; // teal-500
    case 'report':
      return <FileJson color="#EC4899" className="h-5 w-5" />; // pink-500
    case 'technical':
      return <FileCog color="#06B6D4" className="h-5 w-5" />; // cyan-500
    case 'code':
      return <FileCode color="#6366F1" className="h-5 w-5" />; // indigo-500
    default:
      return <File color="#6B7280" className="h-5 w-5" />; // gray-500
  }
};
