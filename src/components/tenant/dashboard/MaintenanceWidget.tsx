
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, ArrowUpRight, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { MaintenanceRequest } from "@/types/tenant";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@/lib/utils";

interface MaintenanceWidgetProps {
  requests: MaintenanceRequest[];
}

export const MaintenanceWidget = ({ requests }: MaintenanceWidgetProps) => {
  const { t } = useLocale();
  const navigate = useNavigate();
  
  return (
    <Card className="shadow-sm transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Wrench className="h-5 w-5 text-primary" />
          {t('maintenanceRequests')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {requests.length === 0 ? (
          <div className="text-center py-6">
            <Wrench className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-sm text-muted-foreground">{t('noMaintenanceRequests')}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {requests.slice(0, 3).map((request) => (
              <div 
                key={request.id} 
                className="flex items-center justify-between p-2 rounded-md hover:bg-muted transition-colors"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium truncate">{request.issue}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(request.created_at)}
                  </span>
                </div>
                <Badge
                  variant={request.status === "Resolved" ? "default" : "secondary"}
                  className={
                    request.status === "Resolved"
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-yellow-500 hover:bg-yellow-600 text-white"
                  }
                >
                  {request.status}
                </Badge>
              </div>
            ))}
            
            {requests.length > 3 && (
              <div className="text-sm text-center text-muted-foreground">
                {t('andMoreRequests', { count: requests.length - 3 + "" })}
              </div>
            )}
          </div>
        )}
        
        <div className="flex gap-2 mt-2">
          <Button 
            className="flex-1"
            variant="outline"
            onClick={() => navigate('/tenant/maintenance')}
          >
            {t('viewAll')}
            <ArrowUpRight className="h-4 w-4 ml-1" />
          </Button>
          <Button 
            className="flex-1"
            onClick={() => navigate('/tenant/maintenance/new')}
          >
            {t('newRequest')}
            <PlusCircle className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
