
import { useState, useMemo, useEffect } from "react";
import { TenantDocument } from "@/types/tenant";

export const useDocumentFilters = (documents: TenantDocument[] | undefined) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocType, setSelectedDocType] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Debug logging for filter changes
  useEffect(() => {
    console.log("Filter changed - Search:", searchQuery, "Type:", selectedDocType, "Category:", selectedCategory, "Sort:", sortBy, sortOrder);
  }, [searchQuery, selectedDocType, selectedCategory, sortBy, sortOrder]);

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
    if (selectedDocType && selectedDocType !== "all") {
      filtered = filtered.filter(doc => 
        doc.document_type === selectedDocType
      );
      console.log("After type filter:", filtered.length);
    }
    
    // Filter by category
    if (selectedCategory && selectedCategory !== "all") {
      if (selectedCategory === "uncategorized") {
        filtered = filtered.filter(doc => 
          !doc.category || doc.category === ""
        );
      } else {
        filtered = filtered.filter(doc => 
          doc.category === selectedCategory
        );
      }
      console.log("After category filter:", filtered.length);
    }
    
    // Sort documents
    filtered.sort((a, b) => {
      if (sortBy === "created_at") {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else if (sortBy === "name") {
        const nameA = (a.name || "").toLowerCase();
        const nameB = (b.name || "").toLowerCase();
        return sortOrder === "asc" 
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      } else if (sortBy === "document_type") {
        const typeA = (a.document_type || "").toLowerCase();
        const typeB = (b.document_type || "").toLowerCase();
        return sortOrder === "asc"
          ? typeA.localeCompare(typeB)
          : typeB.localeCompare(typeA);
      }
      return 0;
    });
    
    console.log("Final filtered documents:", filtered.length);
    return filtered;
  }, [documents, searchQuery, selectedDocType, selectedCategory, sortBy, sortOrder]);

  return {
    filteredDocuments,
    searchQuery,
    setSearchQuery,
    selectedDocType,
    setSelectedDocType,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder
  };
};
