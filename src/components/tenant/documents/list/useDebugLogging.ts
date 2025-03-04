
import { useEffect } from "react";
import { TenantDocument } from "@/types/tenant";

export const useDebugLogging = (
  documents: TenantDocument[] | undefined, 
  isLoading: boolean
) => {
  useEffect(() => {
    console.log("DocumentsList - Documents:", documents?.length);
    console.log("DocumentsList - Loading:", isLoading);
    if (documents?.length > 0) {
      console.log("DocumentsList - First document sample:", documents[0]);
      
      // Check if any document is missing file_url
      const missingUrl = documents.filter(doc => !doc.file_url);
      if (missingUrl.length > 0) {
        console.warn("Documents missing file_url:", missingUrl.length);
        console.warn("First missing URL document:", missingUrl[0]);
      }
    }
  }, [documents, isLoading]);
};
