
import { Wrench, ArrowUpRight, PlusCircle, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { MaintenanceRequest } from "@/types/tenant";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";

interface MaintenanceWidgetProps {
  requests: MaintenanceRequest[];
}

export const MaintenanceWidget = ({ requests }: MaintenanceWidgetProps) => {
  const { t, language } = useLocale();
  const navigate = useNavigate();
  
  const getTranslatedStatus = (status: string) => {
    switch(status) {
      case "Resolved": return t('resolved');
      case "In Progress": return t('inProgress');
      case "Pending": return t('pending');
      default: return status;
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch(status) {
      case "Resolved": return <CheckCircle className="h-4 w-4" />;
      case "In Progress": return <Clock className="h-4 w-4" />;
      case "Pending": return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };
  
  // Sort requests to show updates first
  const sortedRequests = [...requests].sort((a, b) => {
    // Prioritize unnotified requests
    if (a.tenant_notified === false && b.tenant_notified !== false) return -1;
    if (a.tenant_notified !== false && b.tenant_notified === false) return 1;
    
    // Then sort by update date or creation date
    const aDate = a.updated_at || a.created_at;
    const bDate = b.updated_at || b.created_at;
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });

  // Count unread updates
  const unreadUpdates = sortedRequests.filter(req => req.tenant_notified === false).length;
  const pendingCount = sortedRequests.filter(req => req.status === 'Pending').length;
  const inProgressCount = sortedRequests.filter(req => req.status === 'In Progress').length;
  const resolvedCount = sortedRequests.filter(req => req.status === 'Resolved').length;

  const handleNewRequest = () => {
    navigate('/tenant/maintenance/new');
  };
  
  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border border-amber-100/50 dark:from-amber-950/80 dark:via-yellow-950/70 dark:to-orange-950/60 dark:border-amber-800/30"
    >
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-amber-200/40 to-yellow-300/30 rounded-full -translate-y-14 translate-x-14 dark:from-amber-700/20 dark:to-yellow-600/15" />
      
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center">
            <div className="relative">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 text-white shadow-lg">
                <Wrench className="h-5 w-5" />
              </div>
              {unreadUpdates > 0 && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold shadow-md"
                >
                  {unreadUpdates > 9 ? '9+' : unreadUpdates}
                </motion.div>
              )}
            </div>
            <div className="ml-3">
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">{t('maintenanceRequests')}</h3>
              <div className="flex items-center space-x-3 mt-1">
                {pendingCount > 0 && (
                  <div className="flex items-center text-xs text-amber-600 dark:text-amber-400">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {pendingCount} en attente
                  </div>
                )}
                {inProgressCount > 0 && (
                  <div className="flex items-center text-xs text-blue-600 dark:text-blue-400">
                    <Clock className="h-3 w-3 mr-1" />
                    {inProgressCount} en cours
                  </div>
                )}
              </div>
            </div>
          </div>
          {unreadUpdates > 0 && (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: [0.8, 1.1, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse", repeatDelay: 3 }}
            >
              <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-semibold px-3 py-1 shadow-md">
                {unreadUpdates} {unreadUpdates === 1 ? 'nouvelle mise à jour' : 'nouvelles mises à jour'}
              </Badge>
            </motion.div>
          )}
        </div>
        
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="text-center py-8 bg-white/70 dark:bg-gray-800/50 rounded-xl border border-amber-100/50 dark:border-amber-800/30">
              <div className="inline-flex p-4 rounded-full bg-green-100 dark:bg-green-900/40 mb-3">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-300 font-medium">{t('noMaintenanceRequests')}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Tout fonctionne parfaitement !</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedRequests.slice(0, 3).map((request, index) => (
                <motion.div 
                  key={request.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`group flex items-center justify-between p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border ${
                    request.tenant_notified === false 
                      ? 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/40 dark:to-amber-900/30 border-yellow-300 dark:border-yellow-700/50 shadow-yellow-100/50' 
                      : 'bg-white/80 dark:bg-gray-800/60 border-amber-100/30 dark:border-amber-800/20 hover:border-amber-200 dark:hover:border-amber-700/40'
                  }`}
                  onClick={() => navigate('/tenant/maintenance')}
                >
                  <div className="flex items-center flex-1 min-w-0">
                    <div className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
                      request.status === "Resolved" 
                        ? "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400"
                        : request.status === "In Progress"
                        ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                        : "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400"
                    }`}>
                      {getStatusIcon(request.status)}
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex items-center">
                        <span className="text-sm font-medium truncate text-gray-800 dark:text-gray-200 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                          {request.issue}
                        </span>
                        {request.tenant_notified === false && (
                          <span className="ml-2 text-xs bg-yellow-200 dark:bg-yellow-700 px-2 py-1 rounded-full text-yellow-800 dark:text-yellow-200 font-medium animate-pulse">
                            Nouveau !
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {request.updated_at && request.updated_at !== request.created_at 
                            ? `Mis à jour: ${formatDate(request.updated_at)}`
                            : `Créé: ${formatDate(request.created_at)}`
                          }
                        </span>
                        {request.priority && request.priority !== 'Medium' && (
                          <>
                            <div className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              request.priority === 'High' 
                                ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'
                                : 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                            }`}>
                              {request.priority === 'High' ? 'Urgent' : 'Faible'}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-3">
                    <Badge
                      className={`font-semibold px-2.5 py-1 ${
                        request.status === "Resolved"
                          ? "bg-green-500 hover:bg-green-600 text-white"
                          : request.status === "In Progress"
                          ? "bg-blue-500 hover:bg-blue-600 text-white"
                          : "bg-amber-500 hover:bg-amber-600 text-white"
                      }`}
                    >
                      {getTranslatedStatus(request.status)}
                    </Badge>
                    <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors" />
                  </div>
                </motion.div>
              ))}
              
              {sortedRequests.length > 3 && (
                <div className="text-center pt-2">
                  <div className="text-sm text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-800/30 rounded-lg px-3 py-2 inline-block">
                    {t('andMoreRequests', { count: (sortedRequests.length - 3).toString() })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="mt-5 pt-4 border-t border-amber-100/50 dark:border-amber-800/30">
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline"
              className="justify-center text-sm border-amber-200 bg-white/80 text-amber-700 hover:bg-amber-50 hover:text-amber-800 dark:bg-gray-800/50 dark:hover:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/50 rounded-xl shadow-sm hover:shadow-md transition-all group"
              onClick={() => navigate('/tenant/maintenance')}
              size="sm"
            >
              <div className="flex items-center">
                <Wrench className="h-4 w-4 mr-2" />
                {t('viewAll')}
              </div>
            </Button>
            <Button 
              className="justify-center text-sm bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white rounded-xl shadow-sm hover:shadow-md transition-all group"
              onClick={handleNewRequest}
              size="sm"
            >
              <div className="flex items-center">
                <PlusCircle className="h-4 w-4 mr-2" />
                {t('newRequest')}
              </div>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
