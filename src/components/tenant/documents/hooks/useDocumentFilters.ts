
import { useState, useEffect } from "react";
import { TenantDocument } from "@/types/tenant";

export const useDocumentFilters = (documents: TenantDocument[]) => {
  const [filteredDocuments, setFilteredDocuments] = useState<TenantDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocType, setSelectedDocType] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "name">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    if (documents.length > 0) {
      applyFilters();
    } else {
      setFilteredDocuments([]);
    }
  }, [documents, searchQuery, selectedDocType, sortBy, sortOrder]);

  const applyFilters = () => {
    let filtered = [...documents];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply document type filter
    if (selectedDocType) {
      filtered = filtered.filter(doc => {
        const lowerName = doc.name.toLowerCase();
        if (selectedDocType === "lease") {
          return lowerName.includes("lease") || lowerName.includes("bail");
        } else if (selectedDocType === "receipt") {
          return lowerName.includes("receipt") || lowerName.includes("reçu") || lowerName.includes("payment");
        } else {
          return !lowerName.includes("lease") && !lowerName.includes("bail") && 
                 !lowerName.includes("receipt") && !lowerName.includes("reçu") && 
                 !lowerName.includes("payment");
        }
      });
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
