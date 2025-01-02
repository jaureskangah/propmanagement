import { MessageSquare, Search, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Communication } from "@/types/tenant";
import { formatDate } from "@/lib/utils";
import { useState, useMemo } from "react";

interface TenantCommunicationsProps {
  communications: Communication[];
}

export const TenantCommunications = ({ communications }: TenantCommunicationsProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("");

  // Group communications by type
  const groupedCommunications = useMemo(() => {
    return communications.reduce((acc, comm) => {
      if (!acc[comm.type]) {
        acc[comm.type] = [];
      }
      acc[comm.type].push(comm);
      return acc;
    }, {} as Record<string, Communication[]>);
  }, [communications]);

  // Get unique communication types
  const communicationTypes = useMemo(() => {
    return Array.from(new Set(communications.map(comm => comm.type)));
  }, [communications]);

  // Filter communications based on search, type, and date
  const filteredCommunications = useMemo(() => {
    let filtered = communications;

    if (searchQuery) {
      filtered = filtered.filter(comm => 
        comm.subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedType) {
      filtered = filtered.filter(comm => comm.type === selectedType);
    }

    if (startDate) {
      filtered = filtered.filter(comm => 
        new Date(comm.created_at) >= new Date(startDate)
      );
    }

    return filtered;
  }, [communications, searchQuery, selectedType, startDate]);

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'email':
        return '📧';
      case 'sms':
        return '📱';
      case 'notification':
        return '🔔';
      default:
        return '📝';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-lg">Communication History</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search and Filter Section */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search communications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedType === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(null)}
              >
                All
              </Button>
              {communicationTypes.map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </Button>
              ))}
            </div>
            <div className="relative w-full sm:w-auto">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Communications List */}
          {filteredCommunications.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                No communications found
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedCommunications).map(([type, comms]) => (
                <div key={type} className="space-y-2">
                  <h3 className="font-medium flex items-center gap-2">
                    {getTypeIcon(type)} {type}
                    <Badge variant="secondary" className="ml-2">
                      {comms.length}
                    </Badge>
                  </h3>
                  <div className="space-y-2">
                    {comms
                      .filter(comm => 
                        (!searchQuery || comm.subject.toLowerCase().includes(searchQuery.toLowerCase())) &&
                        (!startDate || new Date(comm.created_at) >= new Date(startDate))
                      )
                      .map((comm) => (
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
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};