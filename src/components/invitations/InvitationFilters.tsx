
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface InvitationFiltersProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  invitationsCount: {
    all: number;
    pending: number;
    expired: number;
    completed: number;
    cancelled: number;
  };
  children: React.ReactNode;
}

export const InvitationFilters = ({ 
  activeTab, 
  onTabChange, 
  invitationsCount,
  children 
}: InvitationFiltersProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="all" className="flex items-center gap-2">
          Toutes
          <Badge variant="secondary" className="text-xs">
            {invitationsCount.all}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="pending" className="flex items-center gap-2">
          En attente
          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
            {invitationsCount.pending}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="expired" className="flex items-center gap-2">
          Expirées
          <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
            {invitationsCount.expired}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="completed" className="flex items-center gap-2">
          Acceptées
          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
            {invitationsCount.completed}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="cancelled" className="flex items-center gap-2">
          Annulées
          <Badge variant="secondary" className="text-xs bg-red-100 text-red-700">
            {invitationsCount.cancelled}
          </Badge>
        </TabsTrigger>
      </TabsList>

      <TabsContent value={activeTab} className="mt-6">
        {children}
      </TabsContent>
    </Tabs>
  );
};
