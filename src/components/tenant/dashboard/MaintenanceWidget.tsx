import { Wrench, ArrowUpRight, PlusCircle } from "lucide-react";
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
    return t(status) || status;
  };
  
  // Tri des demandes pour afficher en premier celles qui ont été mises à jour
  const sortedRequests = [...requests].sort((a, b) => {
    // Prioriser les demandes non notifiées
    if (a.tenant_notified === false && b.tenant_notified !== false) return -1;
    if (a.tenant_notified !== false && b.tenant_notified === false) return 1;
    
    // Ensuite, trier par date de mise à jour si disponible, sinon date de création
    const aDate = a.updated_at || a.created_at;
    const bDate = b.updated_at || b.created_at;
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });

  // Nombre de notifications non lues
  const unreadUpdates = sortedRequests.filter(req => req.tenant_notified === false).length;
  
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100 dark:from-amber-950/70 dark:to-yellow-950/70 dark:border-amber-800/50 p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Wrench className="h-5 w-5 mr-2 text-amber-600 dark:text-amber-400" />
          <h3 className="font-semibold text-amber-700 dark:text-amber-300">{t('maintenanceRequests')}</h3>
        </div>
        {unreadUpdates > 0 && (
          <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white dark:bg-yellow-600 dark:hover:bg-yellow-500">
            {unreadUpdates} {unreadUpdates === 1 ? t('newUpdate') : t('newUpdates')}
          </Badge>
        )}
      </div>
      
      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="text-center py-6 bg-white/60 dark:bg-gray-800/40 rounded-lg">
            <Wrench className="h-10 w-10 text-amber-300 dark:text-amber-500/50 mx-auto mb-2 opacity-50" />
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('noMaintenanceRequests')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedRequests.slice(0, 3).map((request, index) => (
              <motion.div 
                key={request.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`flex items-center justify-between p-3 rounded-lg shadow-sm hover:shadow transition-shadow dark:text-gray-200 ${
                  request.tenant_notified === false 
                    ? 'bg-yellow-50/90 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800/30' 
                    : 'bg-white/70 dark:bg-gray-800/40'
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium truncate text-gray-800 dark:text-gray-200">
                    {request.issue}
                    {request.tenant_notified === false && (
                      <span className="ml-2 text-xs bg-yellow-200 dark:bg-yellow-700 px-1.5 py-0.5 rounded-full text-yellow-800 dark:text-yellow-100">
                        {t('updated')}
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {request.updated_at && request.updated_at !== request.created_at 
                      ? `${t('updated')}: ${formatDate(request.updated_at)}`
                      : `${t('createdOn')}: ${formatDate(request.created_at)}`
                    }
                  </span>
                </div>
                <Badge
                  variant={request.status === "Resolved" ? "default" : "secondary"}
                  className={
                    request.status === "Resolved"
                      ? "bg-green-500 hover:bg-green-600 text-white dark:bg-green-700 dark:hover:bg-green-600"
                      : request.status === "In Progress"
                        ? "bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-700 dark:hover:bg-blue-600"
                        : "bg-amber-500 hover:bg-amber-600 text-white dark:bg-amber-700 dark:hover:bg-amber-600"
                  }
                >
                  {getTranslatedStatus(request.status)}
                </Badge>
              </motion.div>
            ))}
            
            {sortedRequests.length > 3 && (
              <div className="text-sm text-center text-gray-500 dark:text-gray-400 mt-2">
                {t('andMoreRequests', { count: (sortedRequests.length - 3).toString() })}
              </div>
            )}
          </div>
        )}
        
        <div className="flex gap-2 mt-4">
          <Button 
            className="flex-1 text-xs md:text-sm border-amber-200 bg-white/80 text-amber-700 hover:bg-amber-50 hover:text-amber-800 dark:bg-gray-800/30 dark:hover:bg-amber-900/30 dark:text-amber-300 dark:hover:text-amber-200 dark:border-amber-900/40"
            variant="outline"
            onClick={() => navigate('/tenant/maintenance')}
            size="sm"
          >
            {t('viewAll')}
            <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
          </Button>
          <Button 
            className="flex-1 text-xs md:text-sm bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-700 dark:hover:bg-amber-600"
            onClick={() => navigate('/tenant/maintenance/new')}
            size="sm"
          >
            {t('newRequest')}
            <PlusCircle className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
