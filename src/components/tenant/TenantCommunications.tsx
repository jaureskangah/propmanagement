import { MessageSquare, Search, Calendar, Mail, MessageCircle, Bell } from "lucide-react";
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
        return <Mail className="h-5 w-5 text-blue-500" />;
      case 'sms':
        return <MessageCircle className="h-5 w-5 text-green-500" />;
      case 'notification':
        return <Bell className="h-5 w-5 text-yellow-500" />;
      default:
        return <MessageSquare className="h-5 w-5 text-purple-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'read':
        return <Badge variant="secondary">Lu</Badge>;
      case 'unread':
        return <Badge variant="default">Non lu</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-lg">Historique des Communications</CardTitle>
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
                placeholder="Rechercher dans les communications..."
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
                Tous
              </Button>
              {communicationTypes.map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type)}
                  className="flex items-center gap-2"
                >
                  {getTypeIcon(type)}
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

          {/* Communications Timeline */}
          {filteredCommunications.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Aucune communication trouvée
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
                  <div className="space-y-2 relative before:absolute before:left-5 before:top-0 before:bottom-0 before:w-px before:bg-border">
                    {comms
                      .filter(comm => 
                        (!searchQuery || comm.subject.toLowerCase().includes(searchQuery.toLowerCase())) &&
                        (!startDate || new Date(comm.created_at) >= new Date(startDate))
                      )
                      .map((comm, index) => (
                        <div
                          key={comm.id}
                          className={`flex items-start gap-4 pl-10 relative animate-fade-in`}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="absolute left-0 top-2 w-10 h-10 flex items-center justify-center bg-background rounded-full border z-10">
                            {getTypeIcon(comm.type)}
                          </div>
                          <div className="flex-1 bg-accent/50 p-4 rounded-lg hover:bg-accent transition-colors">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium">{comm.subject}</h4>
                              {getStatusBadge(comm.status || 'unread')}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {formatDate(comm.created_at)}
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