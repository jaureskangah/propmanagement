import { MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Communication } from "@/types/tenant";
import { formatDate } from "@/lib/utils";

interface TenantCommunicationsProps {
  communications: Communication[];
}

export const TenantCommunications = ({ communications }: TenantCommunicationsProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-purple-600" />
          <CardTitle className="text-lg">Communication History</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {communications.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                No communications recorded yet
              </p>
            </div>
          ) : (
            communications.map((comm) => (
              <div
                key={comm.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100 text-purple-700">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{comm.subject}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="capitalize">{comm.type}</span>
                      <span>•</span>
                      <span>{formatDate(comm.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};