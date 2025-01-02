import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Communication } from "@/types/tenant";
import { useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { CommunicationsList } from "./communications/CommunicationsList";
import { CommunicationFilters } from "./communications/CommunicationFilters";
import { NewCommunicationDialog } from "./communications/NewCommunicationDialog";
import { CommunicationDetailsDialog } from "./communications/CommunicationDetailsDialog";

interface TenantCommunicationsProps {
  communications: Communication[];
  tenantId?: string;
}

export const TenantCommunications = ({ communications, tenantId }: TenantCommunicationsProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [isNewCommDialogOpen, setIsNewCommDialogOpen] = useState(false);
  const [selectedComm, setSelectedComm] = useState<Communication | null>(null);
  const [newCommData, setNewCommData] = useState({
    type: "",
    subject: "",
    content: ""
  });
  const { toast } = useToast();

  // Group communications by type
  const groupedCommunications = useMemo(() => {
    return communications.reduce((acc, comm) => {
      if (!acc[comm.type]) {
        acc[comm.type] = [];
      }
      acc[comm.type].push(comm);
      return acc;
    }, {} as Record<string, Communication[]>);
  }, [communications]);

  // Get unique communication types
  const communicationTypes = useMemo(() => {
    return Array.from(new Set(communications.map(comm => comm.type)));
  }, [communications]);

  // Filter communications based on search, type, and date
  const filteredCommunications = useMemo(() => {
    let filtered = communications;

    if (searchQuery) {
      filtered = filtered.filter(comm => 
        comm.subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedType) {
      filtered = filtered.filter(comm => comm.type === selectedType);
    }

    if (startDate) {
      filtered = filtered.filter(comm => 
        new Date(comm.created_at) >= new Date(startDate)
      );
    }

    return filtered;
  }, [communications, searchQuery, selectedType, startDate]);

  const handleCreateCommunication = async () => {
    if (!tenantId) {
      toast({
        title: "Erreur",
        description: "ID du locataire manquant",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('tenant_communications')
        .insert({
          tenant_id: tenantId,
          type: newCommData.type,
          subject: newCommData.subject,
          content: newCommData.content,
          status: 'unread'
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Communication créée avec succès",
      });

      setIsNewCommDialogOpen(false);
      setNewCommData({ type: "", subject: "", content: "" });
    } catch (error) {
      console.error("Error creating communication:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la création de la communication",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (comm: Communication) => {
    try {
      const newStatus = comm.status === 'read' ? 'unread' : 'read';
      const { error } = await supabase
        .from('tenant_communications')
        .update({ status: newStatus })
        .eq('id', comm.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: `Communication marquée comme ${newStatus === 'read' ? 'lue' : 'non lue'}`,
      });
    } catch (error) {
      console.error("Error updating communication status:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du statut",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Historique des Communications</CardTitle>
          </div>
          <Button 
            onClick={() => setIsNewCommDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nouvelle communication
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <CommunicationFilters
            searchQuery={searchQuery}
            startDate={startDate}
            selectedType={selectedType}
            communicationTypes={communicationTypes}
            onSearchChange={setSearchQuery}
            onDateChange={setStartDate}
            onTypeChange={setSelectedType}
          />

          <CommunicationsList
            filteredCommunications={filteredCommunications}
            groupedCommunications={groupedCommunications}
            onCommunicationClick={setSelectedComm}
            onToggleStatus={handleToggleStatus}
          />
        </div>
      </CardContent>

      <NewCommunicationDialog
        isOpen={isNewCommDialogOpen}
        onClose={() => setIsNewCommDialogOpen(false)}
        newCommData={newCommData}
        onDataChange={setNewCommData}
        onSubmit={handleCreateCommunication}
      />

      <CommunicationDetailsDialog
        communication={selectedComm}
        onClose={() => setSelectedComm(null)}
      />
    </Card>
  );
};