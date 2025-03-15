
import { Communication } from "@/types/tenant";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/components/providers/LocaleProvider";
import { CommunicationFilters } from "../CommunicationFilters";
import { CommunicationsTab } from "./CommunicationsTab";

interface CommunicationsTabsProps {
  communications: Communication[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedType: string | null;
  setSelectedType: (type: string | null) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  unreadCount: number;
  urgentCount: number;
  showAll: boolean;
  toggleShowAll: () => void;
  filteredCommunications: Communication[];
  displayedCommunications: Communication[];
  displayedGroupedCommunications: Record<string, Communication[]>;
  initialDisplayCount: number;
  onCommunicationSelect: (comm: Communication) => void;
  onToggleStatus: (comm: Communication) => void;
  onDeleteCommunication: (comm: Communication) => void;
}

export const CommunicationsTabs = ({
  communications,
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm,
  selectedType,
  setSelectedType,
  selectedDate,
  setSelectedDate,
  unreadCount,
  urgentCount,
  showAll,
  toggleShowAll,
  filteredCommunications,
  displayedCommunications,
  displayedGroupedCommunications,
  initialDisplayCount,
  onCommunicationSelect,
  onToggleStatus,
  onDeleteCommunication
}: CommunicationsTabsProps) => {
  const { t } = useLocale();

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
      <TabsList className="w-full grid grid-cols-3 mb-4 p-1 bg-muted/50 rounded-xl">
        <TabsTrigger value="all" className="flex gap-2 items-center rounded-lg py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-800">
          {t("allMessages")}
          <Badge variant="secondary" className="ml-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">{communications.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="urgent" className="flex gap-2 items-center rounded-lg py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-800">
          {t("urgent")}
          <Badge variant="destructive" className="ml-1">{urgentCount}</Badge>
        </TabsTrigger>
        <TabsTrigger value="unread" className="flex gap-2 items-center rounded-lg py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-800">
          {t("unread")}
          <Badge variant="secondary" className="ml-1 bg-blue-500 text-white dark:bg-blue-600">{unreadCount}</Badge>
        </TabsTrigger>
      </TabsList>

      <div className="mt-4 mb-6">
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
        <CommunicationsTab
          displayedCommunications={displayedCommunications}
          displayedGroupedCommunications={displayedGroupedCommunications}
          filteredCommunications={filteredCommunications}
          showAll={showAll}
          toggleShowAll={toggleShowAll}
          initialDisplayCount={initialDisplayCount}
          onCommunicationClick={onCommunicationSelect}
          onToggleStatus={onToggleStatus}
          onDeleteCommunication={onDeleteCommunication}
          searchTerm={searchTerm}
        />
      </TabsContent>
      
      <TabsContent value="urgent" className="mt-4">
        <CommunicationsTab
          displayedCommunications={displayedCommunications}
          displayedGroupedCommunications={displayedGroupedCommunications}
          filteredCommunications={filteredCommunications}
          showAll={showAll}
          toggleShowAll={toggleShowAll}
          initialDisplayCount={initialDisplayCount}
          onCommunicationClick={onCommunicationSelect}
          onToggleStatus={onToggleStatus}
          onDeleteCommunication={onDeleteCommunication}
          searchTerm={searchTerm}
        />
      </TabsContent>
      
      <TabsContent value="unread" className="mt-4">
        <CommunicationsTab
          displayedCommunications={displayedCommunications}
          displayedGroupedCommunications={displayedGroupedCommunications}
          filteredCommunications={filteredCommunications}
          showAll={showAll}
          toggleShowAll={toggleShowAll}
          initialDisplayCount={initialDisplayCount}
          onCommunicationClick={onCommunicationSelect}
          onToggleStatus={onToggleStatus}
          onDeleteCommunication={onDeleteCommunication}
          searchTerm={searchTerm}
        />
      </TabsContent>
    </Tabs>
  );
};
