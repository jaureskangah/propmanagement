
import { Wrench, AlertTriangle, ChevronRight } from "lucide-react";
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
  const { t } = useLocale();
  const navigate = useNavigate();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
      whileHover={{ y: -5 }}
      className="rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-100 p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Wrench className="h-5 w-5 mr-2 text-blue-600" />
          <h3 className="font-semibold text-blue-700">{t('maintenanceRequests')}</h3>
        </div>
        {requests.length > 0 && (
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {requests.length}
          </Badge>
        )}
      </div>
      
      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="text-center py-6 bg-white/60 rounded-lg">
            <Wrench className="h-10 w-10 text-blue-300 mx-auto mb-2 opacity-50" />
            <p className="text-sm text-gray-500">{t('noMaintenanceRequests')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.slice(0, 3).map((request, index) => (
              <motion.div 
                key={request.id} 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-white/70 rounded-lg shadow-sm hover:shadow transition-shadow"
              >
                <div className="flex flex-col pr-2">
                  <span className="text-sm font-medium truncate text-gray-800">
                    {request.issue}
                    {request.priority === 'Urgent' && (
                      <AlertTriangle className="inline-block h-3.5 w-3.5 ml-1 text-red-500" />
                    )}
                  </span>
                  <span className="text-xs text-gray-500">
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
              </motion.div>
            ))}
            
            {requests.length > 3 && (
              <div className="text-center mt-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => navigate('/tenant/maintenance')}
                >
                  {t('viewAll')} <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
