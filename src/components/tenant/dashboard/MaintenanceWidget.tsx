
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
  const { t } = useLocale();
  const navigate = useNavigate();
  
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100 p-5"
    >
      <div className="flex items-center mb-4">
        <Wrench className="h-5 w-5 mr-2 text-amber-600" />
        <h3 className="font-semibold text-amber-700">{t('maintenanceRequests')}</h3>
      </div>
      
      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="text-center py-6 bg-white/60 rounded-lg">
            <Wrench className="h-10 w-10 text-amber-300 mx-auto mb-2 opacity-50" />
            <p className="text-sm text-gray-500">{t('noMaintenanceRequests')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.slice(0, 3).map((request, index) => (
              <motion.div 
                key={request.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-white/70 rounded-lg shadow-sm hover:shadow transition-shadow"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium truncate text-gray-800">{request.issue}</span>
                  <span className="text-xs text-gray-500">
                    {formatDate(request.created_at)}
                  </span>
                </div>
                <Badge
                  variant={request.status === "Resolved" ? "default" : "secondary"}
                  className={
                    request.status === "Resolved"
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-amber-500 hover:bg-amber-600 text-white"
                  }
                >
                  {request.status}
                </Badge>
              </motion.div>
            ))}
            
            {requests.length > 3 && (
              <div className="text-sm text-center text-gray-500 mt-2">
                {t('andMoreRequests', { count: (requests.length - 3).toString() })}
              </div>
            )}
          </div>
        )}
        
        <div className="flex gap-2 mt-4">
          <Button 
            className="flex-1 text-xs md:text-sm border-amber-200 bg-white/80 text-amber-700 hover:bg-amber-50 hover:text-amber-800"
            variant="outline"
            onClick={() => navigate('/tenant/maintenance')}
            size="sm"
          >
            {t('viewAll')}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
          <Button 
            className="flex-1 text-xs md:text-sm bg-amber-600 hover:bg-amber-700 text-white"
            onClick={() => navigate('/tenant/maintenance/new')}
            size="sm"
          >
            {t('newRequest')}
            <PlusCircle className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
