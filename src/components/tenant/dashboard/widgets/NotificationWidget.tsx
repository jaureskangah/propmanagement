
import { Bell, MessageSquare, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Communication, MaintenanceRequest } from "@/types/tenant";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface NotificationWidgetProps {
  communications: Communication[];
  maintenanceRequests: MaintenanceRequest[];
}

export const NotificationWidget = ({ communications, maintenanceRequests }: NotificationWidgetProps) => {
  const { t } = useLocale();
  const navigate = useNavigate();
  
  const unreadMessages = communications.filter(comm => comm.status === 'unread').length;
  const pendingMaintenance = maintenanceRequests.filter(req => req.status === 'Pending').length;
  
  const hasNotifications = unreadMessages > 0 || pendingMaintenance > 0;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      whileHover={{ y: -5 }}
      className="rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 p-5 h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Bell className="h-5 w-5 mr-2 text-rose-600" />
          <h3 className="font-semibold text-rose-700">{t('notifications')}</h3>
          {hasNotifications && (
            <Badge variant="default" className="ml-2 bg-rose-500 hover:bg-rose-600">
              {unreadMessages + pendingMaintenance}
            </Badge>
          )}
        </div>
      </div>
      
      <div className="space-y-4 flex-1">
        {!hasNotifications ? (
          <div className="text-center py-6 bg-white/60 rounded-lg">
            <Bell className="h-8 w-8 text-rose-300 mx-auto mb-2 opacity-50" />
            <p className="text-sm text-gray-500">{t('noNotifications')}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {unreadMessages > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between p-3 bg-white/60 rounded-lg"
              >
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2 text-blue-600" />
                  <span className="text-gray-700">{t('unreadMessages')}</span>
                </div>
                <Badge variant="outline" className="ml-auto bg-blue-50 text-blue-700 border-blue-200">
                  {unreadMessages}
                </Badge>
              </motion.div>
            )}
            
            {pendingMaintenance > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex items-center justify-between p-3 bg-white/60 rounded-lg"
              >
                <div className="flex items-center">
                  <Wrench className="h-4 w-4 mr-2 text-amber-600" />
                  <span className="text-gray-700">{t('pendingMaintenanceRequests')}</span>
                </div>
                <Badge variant="outline" className="ml-auto bg-amber-50 text-amber-700 border-amber-200">
                  {pendingMaintenance}
                </Badge>
              </motion.div>
            )}
          </div>
        )}
        
        <Separator className="my-3 bg-rose-100/50" />
        
        <div className="flex flex-col gap-2 mt-auto">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start text-xs bg-white/80 hover:bg-blue-50 text-blue-700 hover:text-blue-800 border-blue-100" 
            onClick={() => navigate('/tenant/communications')}
          >
            <MessageSquare className="h-3.5 w-3.5 mr-2" /> 
            <span>{t('viewMessages')}</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start text-xs bg-white/80 hover:bg-amber-50 text-amber-700 hover:text-amber-800 border-amber-100"
            onClick={() => navigate('/tenant/maintenance')}
          >
            <Wrench className="h-3.5 w-3.5 mr-2" /> 
            <span>{t('viewMaintenanceRequests')}</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
