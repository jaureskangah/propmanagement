
import { useState, useEffect } from "react";
import { TenantDocument } from "@/types/tenant";

export const useDocumentFilters = (documents: TenantDocument[]) => {
  const [filteredDocuments, setFilteredDocuments] = useState<TenantDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocType, setSelectedDocType] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "name">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    console.log("useDocumentFilters - Original documents:", documents.length, documents);
    if (documents.length > 0) {
      applyFilters();
    } else {
      setFilteredDocuments([]);
    }
  }, [documents, searchQuery, selectedDocType, sortBy, sortOrder]);

  const applyFilters = () => {
    let filtered = [...documents];
    console.log("Applying filters to documents:", filtered.length);
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      console.log("After search filter:", filtered.length);
    }
    
    // Apply document type filter using document_type field
    if (selectedDocType) {
      filtered = filtered.filter(doc => 
        doc.document_type === selectedDocType
      );
      console.log("After type filter:", filtered.length);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc" 
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
    });
    
    console.log("Final filtered documents:", filtered.length);
    setFilteredDocuments(filtered);
  };

  return {
    filteredDocuments,
    searchQuery,
    setSearchQuery,
    selectedDocType,
    setSelectedDocType,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder
  };
};
