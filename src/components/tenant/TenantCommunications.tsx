import { MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Communication } from "@/types/tenant";

interface TenantCommunicationsProps {
  communications: Communication[];
}

export const TenantCommunications = ({ communications }: TenantCommunicationsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Communication History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {communications.map((comm) => (
            <div
              key={comm.id}
              className="flex items-center justify-between p-2 border rounded"
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>{comm.subject}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm">{comm.type}</span>
                <span className="text-sm text-muted-foreground">{comm.date}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};