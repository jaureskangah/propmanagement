
import { Bell, MessageSquare, Wrench, ArrowRight } from "lucide-react";
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
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 border border-rose-100/50 dark:from-rose-950/80 dark:via-pink-950/70 dark:to-purple-950/60 dark:border-rose-800/30"
    >
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rose-200/30 to-pink-300/20 rounded-full -translate-y-16 translate-x-16 dark:from-rose-800/20 dark:to-pink-700/10" />
      
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center">
            <div className="relative">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-lg">
                <Bell className="h-5 w-5" />
              </div>
              {totalNotifications > 0 && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold shadow-md"
                >
                  {totalNotifications > 9 ? '9+' : totalNotifications}
                </motion.div>
              )}
            </div>
            <div className="ml-3">
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">{t('notifications')}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {hasNotifications ? t('newUpdates') : t('allCaught')}
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {!hasNotifications ? (
            <div className="text-center py-8 bg-white/70 dark:bg-gray-800/50 rounded-xl border border-rose-100/50 dark:border-rose-800/30">
              <div className="inline-flex p-3 rounded-full bg-green-100 dark:bg-green-900/30 mb-3">
                <Bell className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-300 font-medium">{t('noNotifications')}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Vous êtes à jour !</p>
            </div>
          ) : (
            <div className="space-y-3">
              {unreadMessages > 0 && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center justify-between p-4 bg-white/80 dark:bg-gray-800/60 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-blue-100/50 dark:border-blue-800/30 cursor-pointer group"
                  onClick={() => navigate('/tenant/communications')}
                >
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/70 transition-colors">
                      <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <span className="text-gray-800 dark:text-gray-200 font-medium">{t('unreadMessages')}</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Nouveaux messages</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-2.5 py-1">
                      {unreadMessages}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                </motion.div>
              )}
              
              {unreadMaintenance > 0 && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/20 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-yellow-200 dark:border-yellow-800/30 cursor-pointer group"
                  onClick={() => navigate('/tenant/maintenance')}
                >
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/50 group-hover:bg-yellow-200 dark:group-hover:bg-yellow-800/70 transition-colors">
                      <Wrench className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="ml-3">
                      <span className="text-gray-800 dark:text-gray-200 font-medium">{t('maintenanceUpdates')}</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Mises à jour disponibles</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-2.5 py-1">
                      {unreadMaintenance}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-amber-500 transition-colors" />
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
        
        <Separator className="my-5 bg-gradient-to-r from-transparent via-rose-200 to-transparent dark:via-rose-700" />
        
        <div className="grid grid-cols-1 gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-between text-sm bg-white/80 hover:bg-blue-50 text-blue-700 hover:text-blue-800 border-blue-200 dark:bg-gray-800/50 dark:hover:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50 rounded-xl shadow-sm hover:shadow-md transition-all group" 
            onClick={() => navigate('/tenant/communications')}
          >
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" /> 
              {t('viewMessages')}
            </div>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-between text-sm bg-white/80 hover:bg-amber-50 text-amber-700 hover:text-amber-800 border-amber-200 dark:bg-gray-800/50 dark:hover:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/50 rounded-xl shadow-sm hover:shadow-md transition-all group"
            onClick={() => navigate('/tenant/maintenance')}
          >
            <div className="flex items-center">
              <Wrench className="h-4 w-4 mr-2" /> 
              {t('viewMaintenanceRequests')}
            </div>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
