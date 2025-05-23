
import { Bell, MessageSquare, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Communication, MaintenanceRequest } from "@/types/tenant";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface NotificationSummaryProps {
  communications: Communication[];
  maintenanceRequests: MaintenanceRequest[];
}

export const NotificationSummary = ({ communications, maintenanceRequests }: NotificationSummaryProps) => {
  const { t } = useLocale();
  const navigate = useNavigate();
  
  const unreadMessages = communications.filter(comm => comm.status === 'unread').length;
  const pendingMaintenance = maintenanceRequests.filter(req => req.status === 'Pending').length;
  const unreadMaintenance = maintenanceRequests.filter(req => req.tenant_notified === false).length;
  
  const hasNotifications = unreadMessages > 0 || pendingMaintenance > 0 || unreadMaintenance > 0;
  const totalNotifications = unreadMessages + unreadMaintenance;
  
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 dark:from-rose-950/70 dark:to-pink-950/70 dark:border-rose-800/50 p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Bell className="h-5 w-5 mr-2 text-rose-600 dark:text-rose-400" />
          <h3 className="font-semibold text-rose-700 dark:text-rose-300">{t('notifications')}</h3>
          {totalNotifications > 0 && (
            <Badge variant="default" className="ml-2 bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700">
              {totalNotifications}
            </Badge>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        {!hasNotifications ? (
          <div className="text-center py-6 bg-white/60 dark:bg-gray-800/40 rounded-lg">
            <Bell className="h-10 w-10 text-rose-300 dark:text-rose-500/50 mx-auto mb-2 opacity-50" />
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('noNotifications')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {unreadMessages > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between p-3 bg-white/60 dark:bg-gray-800/40 rounded-lg"
              >
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                  <span className="text-gray-700 dark:text-gray-300">{t('unreadMessages')}</span>
                </div>
                <Badge variant="outline" className="ml-auto bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700/50">
                  {unreadMessages}
                </Badge>
              </motion.div>
            )}
            
            {unreadMaintenance > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex items-center justify-between p-3 bg-yellow-50/80 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800/30 rounded-lg"
              >
                <div className="flex items-center">
                  <Wrench className="h-4 w-4 mr-2 text-amber-600 dark:text-amber-400" />
                  <span className="text-gray-700 dark:text-gray-300">{t('maintenanceUpdates')}</span>
                </div>
                <Badge variant="outline" className="ml-auto bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700/50">
                  {unreadMaintenance}
                </Badge>
              </motion.div>
            )}
            
            {pendingMaintenance > 0 && unreadMaintenance === 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex items-center justify-between p-3 bg-white/60 dark:bg-gray-800/40 rounded-lg"
              >
                <div className="flex items-center">
                  <Wrench className="h-4 w-4 mr-2 text-amber-600 dark:text-amber-400" />
                  <span className="text-gray-700 dark:text-gray-300">{t('pendingMaintenanceRequests')}</span>
                </div>
                <Badge variant="outline" className="ml-auto bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700/50">
                  {pendingMaintenance}
                </Badge>
              </motion.div>
            )}
          </div>
        )}
        
        <Separator className="my-4 bg-rose-100/50 dark:bg-rose-800/30" />
        
        <div className="flex flex-col gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start text-xs md:text-sm bg-white/80 hover:bg-blue-50 text-blue-700 hover:text-blue-800 border-blue-100 dark:bg-gray-800/30 dark:hover:bg-blue-900/30 dark:text-blue-300 dark:hover:text-blue-200 dark:border-blue-900/40" 
            onClick={() => navigate('/tenant/communications')}
          >
            <MessageSquare className="h-3.5 w-3.5 mr-2" /> 
            {t('viewMessages')}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start text-xs md:text-sm bg-white/80 hover:bg-amber-50 text-amber-700 hover:text-amber-800 border-amber-100 dark:bg-gray-800/30 dark:hover:bg-amber-900/30 dark:text-amber-300 dark:hover:text-amber-200 dark:border-amber-900/40"
            onClick={() => navigate('/tenant/maintenance')}
          >
            <Wrench className="h-3.5 w-3.5 mr-2" /> 
            {t('viewMaintenanceRequests')}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
