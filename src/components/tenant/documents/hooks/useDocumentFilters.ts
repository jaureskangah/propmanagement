
import { useState, useMemo, useEffect } from "react";
import { TenantDocument } from "@/types/tenant";

export const useDocumentFilters = (documents: TenantDocument[]) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocType, setSelectedDocType] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "name">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Debug logging for filter changes
  useEffect(() => {
    console.log("Filter changed - Search:", searchQuery, "Type:", selectedDocType, "Sort:", sortBy, sortOrder);
  }, [searchQuery, selectedDocType, sortBy, sortOrder]);

  const filteredDocuments = useMemo(() => {
    console.log("Filtering documents - total:", documents?.length || 0);
    if (!documents || documents.length === 0) return [];
    
    let filtered = [...documents];
    
    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(doc => 
        (doc.name && doc.name.toLowerCase().includes(query))
      );
      console.log("After search filter:", filtered.length);
    }
    
    // Filter by document type
    if (selectedDocType) {
      filtered = filtered.filter(doc => 
        doc.document_type === selectedDocType
      );
      console.log("After type filter:", filtered.length);
    }
    
    // Sort documents
    filtered.sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        const nameA = (a.name || "").toLowerCase();
        const nameB = (b.name || "").toLowerCase();
        return sortOrder === "asc" 
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      }
    });
    
    console.log("Final filtered documents:", filtered.length);
    return filtered;
  }, [documents, searchQuery, selectedDocType, sortBy, sortOrder]);

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
