
export interface DocumentHistoryEntry {
  id: string;
  name: string;
  category: string;
  documentType: string;
  fileUrl?: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
}
