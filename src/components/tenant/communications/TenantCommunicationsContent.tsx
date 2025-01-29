import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CommunicationsContent } from "./CommunicationsContent";
import { NewCommunicationDialog } from "./NewCommunicationDialog";
import { useState } from "react";
import { Communication } from "@/types/tenant";

interface TenantCommunicationsContentProps {
  communications: Communication[];
  onCreateCommunication: (subject: string, content: string) => Promise<boolean>;
  onCommunicationUpdate: () => void;
}

export const TenantCommunicationsContent = ({
  communications,
  onCreateCommunication,
  onCommunicationUpdate
}: TenantCommunicationsContentProps) => {
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const [newCommData, setNewCommData] = useState({
    subject: "",
    content: "",
    category: "general"
  });

  const handleCreateSubmit = async () => {
    const success = await onCreateCommunication(newCommData.subject, newCommData.content);
    if (success) {
      setIsNewMessageOpen(false);
      setNewCommData({ subject: "", content: "", category: "general" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Communications</h1>
        <Button 
          onClick={() => setIsNewMessageOpen(true)}
          className="bg-[#ea384c] hover:bg-[#ea384c]/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Message
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Message History</CardTitle>
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