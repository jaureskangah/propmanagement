import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TenantDocument } from "@/types/tenant";

interface TenantDocumentsProps {
  documents: TenantDocument[];
}

export const TenantDocuments = ({ documents }: TenantDocumentsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Lease Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-2 border rounded"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>{doc.name}</span>
              </div>
              <span className="text-sm text-muted-foreground">{doc.date}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};