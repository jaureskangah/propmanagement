
import { useState, useEffect } from "react";
import { TenantDocument } from "@/types/tenant";

export const useDocumentFilters = (documents: TenantDocument[]) => {
  const [filteredDocuments, setFilteredDocuments] = useState<TenantDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocType, setSelectedDocType] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "name">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    console.log("useDocumentFilters - Documents à filtrer:", documents.length, documents);
    
    // Toujours définir les documents filtrés, même si le tableau est vide
    if (documents.length === 0) {
      setFilteredDocuments([]);
    } else {
      applyFilters();
    }
  }, [documents, searchQuery, selectedDocType, sortBy, sortOrder]);

  const applyFilters = () => {
    // Clone pour éviter de modifier l'original
    let filtered = [...documents];
    console.log("Applying filters to documents:", filtered.length);
    
    // Filtre par recherche
    if (searchQuery.trim()) {
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      console.log("After search filter:", filtered.length);
    }
    
    // Filtre par type de document
    if (selectedDocType) {
      filtered = filtered.filter(doc => 
        doc.document_type === selectedDocType
      );
      console.log("After type filter:", filtered.length);
    }
    
    // Appliquer le tri
    filtered.sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
    });
    
    console.log("Final filtered documents:", filtered.length, filtered);
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
