
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, MessageSquare, Wrench, FileText, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Communication, MaintenanceRequest } from "@/types/tenant";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useNavigate } from "react-router-dom";

interface NotificationSummaryProps {
  communications: Communication[];
  maintenanceRequests: MaintenanceRequest[];
}

export const NotificationSummary = ({ communications, maintenanceRequests }: NotificationSummaryProps) => {
  const { t } = useLocale();
  const navigate = useNavigate();
  
  const unreadMessages = communications.filter(comm => comm.status === 'unread').length;
  const pendingMaintenance = maintenanceRequests.filter(req => req.status === 'Pending').length;
  
  const hasNotifications = unreadMessages > 0 || pendingMaintenance > 0;
  
  return (
    <Card className="shadow-sm transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          {t('notifications')}
          {hasNotifications && (
            <Badge variant="default" className="ml-2 bg-red-500 hover:bg-red-600">
              {unreadMessages + pendingMaintenance}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasNotifications ? (
          <div className="text-center py-6">
            <Bell className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-sm text-muted-foreground">{t('noNotifications')}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {unreadMessages > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2 text-blue-500" />
                  <span>{t('unreadMessages')}</span>
                </div>
                <Badge variant="outline" className="ml-auto">
                  {unreadMessages}
                </Badge>
              </div>
            )}
            
            {pendingMaintenance > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Wrench className="h-4 w-4 mr-2 text-amber-500" />
                  <span>{t('pendingMaintenanceRequests')}</span>
                </div>
                <Badge variant="outline" className="ml-auto">
                  {pendingMaintenance}
                </Badge>
              </div>
            )}
          </div>
        )}
        
        <Separator className="my-2" />
        
        <div className="flex flex-col gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start" 
            onClick={() => navigate('/tenant/communications')}
          >
            <MessageSquare className="h-4 w-4 mr-2" /> 
            {t('viewMessages')}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start"
            onClick={() => navigate('/tenant/maintenance')}
          >
            <Wrench className="h-4 w-4 mr-2" /> 
            {t('viewMaintenanceRequests')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
