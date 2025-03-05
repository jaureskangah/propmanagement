
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DocumentsList } from "./list/DocumentsList";
import { DocumentUpload } from "@/components/tenant/DocumentUpload";
import { DocumentGenerator } from "./DocumentGenerator";
import { useLocale } from "@/components/providers/LocaleProvider";
import { TenantDocument } from "@/types/tenant";
import { Tenant } from "@/types/tenant";
import { FileText, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface DocumentsTabsProps {
  documents: TenantDocument[] | undefined;
  filteredDocuments: TenantDocument[] | undefined;
  isLoading: boolean;
  tenant: Tenant | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedDocType: string;
  setSelectedDocType: (type: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
  onViewDocument: (document: TenantDocument) => void;
  onDeleteDocument: (documentId: string, filename: string) => void;
  onDocumentUpdate: () => void;
  error?: Error;
}

export const DocumentsTabs = ({
  documents,
  filteredDocuments,
  isLoading,
  tenant,
  searchQuery,
  setSearchQuery,
  selectedDocType,
  setSelectedDocType,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  onViewDocument,
  onDeleteDocument,
  onDocumentUpdate,
  error
}: DocumentsTabsProps) => {
  const { t } = useLocale();
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <Tabs defaultValue="all" className="mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <TabsList>
          <TabsTrigger value="all">{t("allDocuments")}</TabsTrigger>
          <TabsTrigger value="upload">{t("uploadNewDocument")}</TabsTrigger>
          <TabsTrigger value="generate">{t("generateDocument")}</TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t("searchDocuments")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="icon" title={t("filterDocuments")}>
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="absolute z-10 right-0 mt-2 p-4 bg-background border rounded-lg shadow-lg w-full sm:w-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-1 block">
                    {t("documentType")}
                  </label>
                  <Select value={selectedDocType} onValueChange={setSelectedDocType}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("filterDocuments")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("allDocuments")}</SelectItem>
                      <SelectItem value="lease">{t("leaseDocuments")}</SelectItem>
                      <SelectItem value="receipt">{t("paymentReceipts")}</SelectItem>
                      <SelectItem value="other">{t("otherDocuments")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex-1">
                  <label className="text-sm font-medium mb-1 block">
                    {t("sortBy")}
                  </label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("sortBy")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="created_at">{t("dateUploaded")}</SelectItem>
                      <SelectItem value="name">{t("documentName")}</SelectItem>
                      <SelectItem value="document_type">{t("documentType")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex-1">
                  <label className="text-sm font-medium mb-1 block">
                    {t("order")}
                  </label>
                  <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as "asc" | "desc")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">Newest first</SelectItem>
                      <SelectItem value="asc">Oldest first</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      <TabsContent value="all" className="mt-0">
        <DocumentsList
          documents={documents}
          filteredDocuments={filteredDocuments}
          isLoading={isLoading}
          error={error}
          onViewDocument={onViewDocument}
          onDeleteDocument={onDeleteDocument}
        />
      </TabsContent>

      <TabsContent value="upload" className="mt-0">
        {tenant ? (
          <div className="border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-medium">{t("uploadNewDocument")}</h3>
            </div>
            <DocumentUpload 
              tenantId={tenant.id} 
              onUploadComplete={onDocumentUpdate} 
            />
          </div>
        ) : (
          <div className="border rounded-lg p-6 text-center">
            <p className="text-muted-foreground">
              Tenant profile not found
            </p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="generate" className="mt-0">
        <div className="border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-medium">{t("generateDocument")}</h3>
          </div>
          {tenant ? (
            <DocumentGenerator 
              tenant={tenant} 
              onDocumentGenerated={onDocumentUpdate}
            />
          ) : (
            <div className="text-center">
              <p className="text-muted-foreground">
                Tenant profile not found
              </p>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};
