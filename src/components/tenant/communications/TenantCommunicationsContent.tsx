
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MessageCircle, Mail, Filter } from "lucide-react";
import { CommunicationsContent } from "./CommunicationsContent";
import { NewCommunicationDialog } from "./NewCommunicationDialog";
import { useState } from "react";
import { Communication } from "@/types/tenant";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

interface TenantCommunicationsContentProps {
  communications: Communication[];
  onCreateCommunication: (subject: string, content: string, category?: string) => Promise<boolean>;
  onCommunicationUpdate: () => void;
  tenant?: { email: string; name: string };
}

export const TenantCommunicationsContent = ({
  communications,
  onCreateCommunication,
  onCommunicationUpdate,
  tenant
}: TenantCommunicationsContentProps) => {
  const { t } = useLocale();
  const isMobile = useIsMobile();
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const [activeView, setActiveView] = useState("all");
  const [newCommData, setNewCommData] = useState({
    type: "message",
    subject: "",
    content: "",
    category: "general"
  });

  const unreadCount = communications.filter(comm => comm.status === "unread").length;
  const urgentCount = communications.filter(comm => comm.category === "urgent").length;
  
  const handleCreateSubmit = async () => {
    const success = await onCreateCommunication(
      newCommData.subject, 
      newCommData.content,
      newCommData.category
    );
    if (success) {
      setIsNewMessageOpen(false);
      setNewCommData({ 
        type: "message",
        subject: "", 
        content: "", 
        category: "general" 
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-primary" />
            {t('communications')}
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} {t('unread')}
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground mt-1">
            {communications.length > 0 
              ? `${communications.length} ${t('messages')}` 
              : t('noCommunications')}
          </p>
        </div>
        <Button 
          onClick={() => setIsNewMessageOpen(true)}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('newMessage')}
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveView}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <TabsList className="bg-muted h-auto p-1">
            <TabsTrigger value="all" className="data-[state=active]:bg-background">
              {t('allMessages')}
              <Badge variant="secondary" className="ml-2">{communications.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="urgent" className="data-[state=active]:bg-background">
              {t('urgent')}
              <Badge variant="destructive" className="ml-2">{urgentCount}</Badge>
            </TabsTrigger>
            <TabsTrigger value="unread" className="data-[state=active]:bg-background">
              {t('markAsUnread')}
              <Badge variant="secondary" className="ml-2">{unreadCount}</Badge>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Mail className="h-5 w-5 text-muted-foreground" />
                {t('messageByCategory')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CommunicationsContent
                communications={communications}
                onToggleStatus={() => {}}
                onCommunicationSelect={() => {}}
                onCommunicationUpdate={onCommunicationUpdate}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="urgent">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Mail className="h-5 w-5 text-red-500" />
                {t('urgent')} {t('messages').toLowerCase()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CommunicationsContent
                communications={communications.filter(comm => comm.category === "urgent")}
                onToggleStatus={() => {}}
                onCommunicationSelect={() => {}}
                onCommunicationUpdate={onCommunicationUpdate}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unread">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-500" />
                {t('markAsUnread')} {t('messages').toLowerCase()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CommunicationsContent
                communications={communications.filter(comm => comm.status === "unread")}
                onToggleStatus={() => {}}
                onCommunicationSelect={() => {}}
                onCommunicationUpdate={onCommunicationUpdate}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <NewCommunicationDialog
        isOpen={isNewMessageOpen}
        onClose={() => setIsNewMessageOpen(false)}
        newCommData={newCommData}
        onDataChange={setNewCommData}
        onSubmit={handleCreateSubmit}
      />
    </div>
  );
};
