
import { useState, useEffect } from "react";
import AppSidebar from "@/components/AppSidebar";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { TenantDocument, Tenant } from "@/types/tenant";
import { DocumentsHeader } from "@/components/tenant/documents/DocumentsHeader";
import { DocumentsFilters } from "@/components/tenant/documents/DocumentsFilters";
import { DocumentsList } from "@/components/tenant/documents/DocumentsList";
import { DocumentViewerDialog } from "@/components/tenant/documents/DocumentViewerDialog";
import { useLocale } from "@/components/providers/LocaleProvider";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DocumentGenerator } from "@/components/tenant/documents/DocumentGenerator";

const TenantDocuments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLocale();
  const [documents, setDocuments] = useState<TenantDocument[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<TenantDocument[]>([]);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocType, setSelectedDocType] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "name">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedDocument, setSelectedDocument] = useState<TenantDocument | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTenantData();
    }
  }, [user]);

  useEffect(() => {
    if (documents.length > 0) {
      applyFilters();
    }
  }, [documents, searchQuery, selectedDocType, sortBy, sortOrder]);

  const fetchTenantData = async () => {
    try {
      setIsLoading(true);
      const { data: tenantData, error: tenantError } = await supabase
        .from('tenants')
        .select('*')
        .eq('tenant_profile_id', user?.id)
        .single();

      if (tenantError) throw tenantError;
      
      if (tenantData) {
        setTenant(tenantData);
        await fetchDocuments(tenantData.id);
      } else {
        toast({
          title: "Non lié",
          description: "Votre compte n'est pas lié à un profil locataire",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching tenant data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos données de locataire",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const fetchDocuments = async (tenantId: string) => {
    try {
      const { data, error } = await supabase
        .from('tenant_documents')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setDocuments(data || []);
      setFilteredDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos documents",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleDocumentUpdate = () => {
    if (tenant) {
      fetchDocuments(tenant.id);
    }
  };

  const handleViewDocument = (document: TenantDocument) => {
    setSelectedDocument(document);
    setViewerOpen(true);
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      const { error } = await supabase
        .from('tenant_documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;
      
      toast({
        title: "Succès",
        description: t("docDeleteSuccess"),
      });
      
      handleDocumentUpdate();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le document",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex">
      <AppSidebar isTenant={true} />
      <div className="flex-1 container mx-auto p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <DocumentsHeader 
            tenant={tenant} 
            onDocumentUpdate={handleDocumentUpdate}
          />
          
          <Tabs defaultValue="all" className="mt-6">
            <TabsList className="mb-4">
              <TabsTrigger value="all">{t("allDocuments")}</TabsTrigger>
              <TabsTrigger value="recent">{t("recentlyUploaded")}</TabsTrigger>
              <TabsTrigger value="generate">{t("generateDocument")}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              <DocumentsFilters 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedDocType={selectedDocType}
                setSelectedDocType={setSelectedDocType}
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
              />
              
              <DocumentsList 
                documents={filteredDocuments}
                isLoading={isLoading}
                onViewDocument={handleViewDocument}
                onDeleteDocument={handleDeleteDocument}
              />
            </TabsContent>
            
            <TabsContent value="recent">
              <DocumentsList 
                documents={documents.slice(0, 5)}
                isLoading={isLoading}
                onViewDocument={handleViewDocument}
                onDeleteDocument={handleDeleteDocument}
              />
            </TabsContent>
            
            <TabsContent value="generate">
              {tenant && (
                <DocumentGenerator 
                  tenant={tenant} 
                  onDocumentGenerated={handleDocumentUpdate} 
                />
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
        
        <DocumentViewerDialog 
          document={selectedDocument}
          open={viewerOpen}
          onOpenChange={setViewerOpen}
        />
      </div>
    </div>
  );
};

export default TenantDocuments;
