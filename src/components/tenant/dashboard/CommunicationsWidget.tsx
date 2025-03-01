
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, ArrowUpRight, PlusCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Communication } from "@/types/tenant";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@/lib/utils";

interface CommunicationsWidgetProps {
  communications: Communication[];
}

export const CommunicationsWidget = ({ communications }: CommunicationsWidgetProps) => {
  const { t } = useLocale();
  const navigate = useNavigate();
  
  const unreadCount = communications.filter(comm => comm.status === 'unread').length;
  
  return (
    <Card className="shadow-sm transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          {t('communications')}
          {unreadCount > 0 && (
            <Badge variant="default" className="ml-2 bg-red-500 hover:bg-red-600">
              {unreadCount}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {communications.length === 0 ? (
          <div className="text-center py-6">
            <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-sm text-muted-foreground">{t('noCommunications')}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {communications.slice(0, 3).map((comm) => (
              <div 
                key={comm.id} 
                className={`
                  flex items-center justify-between p-2 rounded-md 
                  hover:bg-muted transition-colors
                  ${comm.status === 'unread' ? 'bg-blue-50 dark:bg-blue-900/10' : ''}
                `}
              >
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center">
                    <span className="text-sm font-medium truncate">{comm.subject}</span>
                    {comm.status === 'unread' && (
                      <Badge variant="default" className="ml-2 h-2 w-2 p-0 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <div className="flex text-xs text-muted-foreground">
                    {!comm.is_from_tenant && <User className="h-3 w-3 mr-1" />}
                    <span className="truncate">
                      {formatDate(comm.created_at)}
                    </span>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={
                    comm.category === "urgent"
                      ? "bg-red-50 text-red-700 border-red-200"
                      : comm.category === "maintenance"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-green-50 text-green-700 border-green-200"
                  }
                >
                  {comm.category}
                </Badge>
              </div>
            ))}
            
            {communications.length > 3 && (
              <div className="text-sm text-center text-muted-foreground">
                {t('andMoreMessages', { count: (communications.length - 3).toString() })}
              </div>
            )}
          </div>
        )}
        
        <div className="flex gap-2 mt-2">
          <Button 
            className="flex-1"
            variant="outline"
            onClick={() => navigate('/tenant/communications')}
          >
            {t('viewAll')}
            <ArrowUpRight className="h-4 w-4 ml-1" />
          </Button>
          <Button 
            className="flex-1"
            onClick={() => navigate('/tenant/communications/new')}
          >
            {t('sendMessage')}
            <PlusCircle className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
