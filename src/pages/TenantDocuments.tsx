
import AppSidebar from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/AuthProvider";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Document } from "@/types/tenant";
import { FileIcon, DownloadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const TenantDocuments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTenantId();
    }
  }, [user]);

  useEffect(() => {
    if (tenantId) {
      fetchDocuments();
    }
  }, [tenantId]);

  const fetchTenantId = async () => {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('id')
        .eq('tenant_profile_id', user?.id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setTenantId(data.id);
      } else {
        toast({
          title: "Non lié",
          description: "Votre compte n'est pas lié à un profil locataire",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching tenant ID:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger votre identifiant de locataire",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('tenant_documents')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      
      setDocuments(data || []);
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

  const handleDownload = (document: Document) => {
    if (document.file_url) {
      window.open(document.file_url, '_blank');
    } else {
      toast({
        title: "Erreur",
        description: "URL du document non disponible",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex">
      <AppSidebar isTenant={true} />
      <div className="flex-1 container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Mes documents</CardTitle>
            <CardDescription>Documents importants liés à votre location</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : !tenantId ? (
              <p className="text-center text-muted-foreground py-8">
                Votre compte n'est pas encore lié à un profil locataire.
              </p>
            ) : documents.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Aucun document n'a été trouvé.
              </p>
            ) : (
              <div className="space-y-4">
                {documents.map((document) => (
                  <div key={document.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileIcon className="h-6 w-6 text-blue-500" />
                      <div>
                        <p className="font-medium">{document.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {document.uploaded_at && format(new Date(document.uploaded_at), 'dd/MM/yyyy')}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDownload(document)}
                      title="Télécharger"
                    >
                      <DownloadIcon className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TenantDocuments;
