
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface InvitationFiltersProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  children: React.ReactNode;
}

export const InvitationFilters = ({ 
  activeTab, 
  onTabChange, 
  children 
}: InvitationFiltersProps) => {
  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={onTabChange}>
      <TabsList className="mb-4">
        <TabsTrigger value="all">Toutes</TabsTrigger>
        <TabsTrigger value="pending">En attente</TabsTrigger>
        <TabsTrigger value="expired">Expirées</TabsTrigger>
        <TabsTrigger value="completed">Acceptées</TabsTrigger>
        <TabsTrigger value="cancelled">Annulées</TabsTrigger>
      </TabsList>
      
      <TabsContent value={activeTab}>
        {children}
      </TabsContent>
    </Tabs>
  );
};
