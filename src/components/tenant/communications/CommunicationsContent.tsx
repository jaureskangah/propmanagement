
import { useState, useMemo, useEffect } from "react";
import { Communication } from "@/types/tenant";
import { CommunicationsFilterBar } from "./filters/CommunicationsFilterBar";
import { CommunicationsListContainer } from "./list/CommunicationsListContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/components/providers/LocaleProvider";
import { CommunicationFilters } from "./CommunicationFilters";

interface CommunicationsContentProps {
  communications: Communication[];
  onToggleStatus: (comm: Communication) => void;
  onCommunicationSelect: (comm: Communication) => void;
  onCommunicationUpdate?: () => void;
  onDeleteCommunication: (comm: Communication) => void;
  tenantId: string;
}

export const CommunicationsContent = ({
  communications,
  onToggleStatus,
  onCommunicationSelect,
  onCommunicationUpdate,
  onDeleteCommunication,
  tenantId
}: CommunicationsContentProps) => {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Fonction pour filtrer les communications
  const filteredCommunications = useMemo(() => {
    return communications.filter(comm => {
      // Filtre par texte
      const textFilter = !searchTerm ||
        (comm.subject && comm.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (comm.content && comm.content.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Filtre par type
      const typeFilter = !selectedType || comm.category === selectedType;
      
      // Filtre par date
      const dateFilter = !selectedDate || 
        (new Date(comm.created_at).toDateString() === new Date(selectedDate).toDateString());
      
      // Filtre par onglet
      let tabFilter = true;
      if (activeTab === "urgent") {
        tabFilter = comm.category === "urgent";
      } else if (activeTab === "unread") {
        tabFilter = comm.status === "unread";
      }
      
      return textFilter && typeFilter && dateFilter && tabFilter;
    });
  }, [communications, searchTerm, selectedType, selectedDate, activeTab]);

  // Regrouper par type de communication
  const groupedCommunications = useMemo(() => {
    const grouped: Record<string, Communication[]> = {};
    
    filteredCommunications.forEach(comm => {
      const type = comm.type || "message";
      if (!grouped[type]) {
        grouped[type] = [];
      }
      grouped[type].push(comm);
    });
    
    return grouped;
  }, [filteredCommunications]);

  // Compter les messages non lus et urgents
  const unreadCount = useMemo(() => {
    return communications.filter(comm => comm.status === "unread").length;
  }, [communications]);
  
  const urgentCount = useMemo(() => {
    return communications.filter(comm => comm.category === "urgent").length;
  }, [communications]);

  // Réinitialiser les filtres lorsque l'onglet change
  useEffect(() => {
    setSearchTerm("");
    setSelectedType(null);
    setSelectedDate("");
  }, [activeTab]);

  return (
    <div className="px-6 pb-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
        <TabsList className="w-full grid grid-cols-3 mb-2">
          <TabsTrigger value="all" className="flex gap-2 items-center">
            {t('allMessages')}
            <Badge variant="secondary" className="ml-1">{communications.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="urgent" className="flex gap-2 items-center">
            {t('urgent')}
            <Badge variant="destructive" className="ml-1">{urgentCount}</Badge>
          </TabsTrigger>
          <TabsTrigger value="unread" className="flex gap-2 items-center">
            {t('unread')}
            <Badge variant="secondary" className="ml-1">{unreadCount}</Badge>
          </TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <CommunicationFilters
            searchQuery={searchTerm}
            startDate={selectedDate}
            selectedType={selectedType}
            communicationTypes={["general", "maintenance", "urgent", "payment"]}
            onSearchChange={setSearchTerm}
            onDateChange={setSelectedDate}
            onTypeChange={setSelectedType}
          />
        </div>
        
        <TabsContent value="all" className="mt-4">
          <CommunicationsListContainer
            filteredCommunications={filteredCommunications}
            groupedCommunications={groupedCommunications}
            onCommunicationClick={onCommunicationSelect}
            onToggleStatus={onToggleStatus}
            onDeleteCommunication={onDeleteCommunication}
          />
        </TabsContent>
        
        <TabsContent value="urgent" className="mt-4">
          <CommunicationsListContainer
            filteredCommunications={filteredCommunications}
            groupedCommunications={groupedCommunications}
            onCommunicationClick={onCommunicationSelect}
            onToggleStatus={onToggleStatus}
            onDeleteCommunication={onDeleteCommunication}
          />
        </TabsContent>
        
        <TabsContent value="unread" className="mt-4">
          <CommunicationsListContainer
            filteredCommunications={filteredCommunications}
            groupedCommunications={groupedCommunications}
            onCommunicationClick={onCommunicationSelect}
            onToggleStatus={onToggleStatus}
            onDeleteCommunication={onDeleteCommunication}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
