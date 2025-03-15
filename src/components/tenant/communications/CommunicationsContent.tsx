
import { useState, useMemo, useEffect } from "react";
import { Communication } from "@/types/tenant";
import { CommunicationsFilterBar } from "./filters/CommunicationsFilterBar";
import { CommunicationsListContainer } from "./list/CommunicationsListContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/components/providers/LocaleProvider";
import { CommunicationFilters } from "./CommunicationFilters";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

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
  const [showAll, setShowAll] = useState(false);
  const INITIAL_DISPLAY_COUNT = 5;

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

  // Communications à afficher (limitées ou toutes)
  const displayedCommunications = useMemo(() => {
    if (showAll) {
      return filteredCommunications;
    }
    return filteredCommunications.slice(0, INITIAL_DISPLAY_COUNT);
  }, [filteredCommunications, showAll]);

  // Grouper les communications à afficher
  const displayedGroupedCommunications = useMemo(() => {
    const grouped: Record<string, Communication[]> = {};
    
    displayedCommunications.forEach(comm => {
      const type = comm.type || "message";
      if (!grouped[type]) {
        grouped[type] = [];
      }
      grouped[type].push(comm);
    });
    
    return grouped;
  }, [displayedCommunications]);

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
    setShowAll(false);
  }, [activeTab]);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  // Composant pour le bouton Voir plus/Voir moins
  const ShowMoreLessButton = () => {
    if (filteredCommunications.length <= INITIAL_DISPLAY_COUNT) {
      return null;
    }

    return (
      <div className="flex justify-center mt-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleShowAll}
          className="flex items-center gap-2"
        >
          {showAll ? (
            <>
              <ChevronUp className="h-4 w-4" />
              {t('showLess')}
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              {t('showMore')}
            </>
          )}
        </Button>
      </div>
    );
  };

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
            filteredCommunications={displayedCommunications}
            groupedCommunications={displayedGroupedCommunications}
            onCommunicationClick={onCommunicationSelect}
            onToggleStatus={onToggleStatus}
            onDeleteCommunication={onDeleteCommunication}
          />
          <ShowMoreLessButton />
        </TabsContent>
        
        <TabsContent value="urgent" className="mt-4">
          <CommunicationsListContainer
            filteredCommunications={displayedCommunications}
            groupedCommunications={displayedGroupedCommunications}
            onCommunicationClick={onCommunicationSelect}
            onToggleStatus={onToggleStatus}
            onDeleteCommunication={onDeleteCommunication}
          />
          <ShowMoreLessButton />
        </TabsContent>
        
        <TabsContent value="unread" className="mt-4">
          <CommunicationsListContainer
            filteredCommunications={displayedCommunications}
            groupedCommunications={displayedGroupedCommunications}
            onCommunicationClick={onCommunicationSelect}
            onToggleStatus={onToggleStatus}
            onDeleteCommunication={onDeleteCommunication}
          />
          <ShowMoreLessButton />
        </TabsContent>
      </Tabs>
    </div>
  );
};
