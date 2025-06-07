
import { Calendar, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { motion } from "framer-motion";

interface LeaseStatusCardProps {
  leaseStart: string;
  leaseEnd: string;
  daysLeft: number;
  status: 'active' | 'expiring' | 'expired';
}

export const LeaseStatusCard = ({ leaseStart, leaseEnd, daysLeft, status }: LeaseStatusCardProps) => {
  const { t } = useLocale();
  
  const getStatusConfig = () => {
    switch (status) {
      case 'active': 
        return {
          gradient: 'from-emerald-50 via-green-50 to-teal-50 border-emerald-100/50 dark:from-emerald-950/80 dark:via-green-950/70 dark:to-teal-950/60 dark:border-emerald-800/30',
          iconBg: 'from-emerald-500 to-green-600',
          textColor: 'text-emerald-700 dark:text-emerald-400',
          progressColor: 'bg-gradient-to-r from-emerald-500 to-green-600',
          decorativeColor: 'from-emerald-200/30 to-green-300/20 dark:from-emerald-800/20 dark:to-green-700/10'
        };
      case 'expiring': 
        return {
          gradient: 'from-amber-50 via-yellow-50 to-orange-50 border-amber-100/50 dark:from-amber-950/80 dark:via-yellow-950/70 dark:to-orange-950/60 dark:border-amber-800/30',
          iconBg: 'from-amber-500 to-yellow-600',
          textColor: 'text-amber-700 dark:text-amber-400',
          progressColor: 'bg-gradient-to-r from-amber-500 to-yellow-600',
          decorativeColor: 'from-amber-200/30 to-yellow-300/20 dark:from-amber-800/20 dark:to-yellow-700/10'
        };
      case 'expired': 
        return {
          gradient: 'from-rose-50 via-red-50 to-pink-50 border-rose-100/50 dark:from-rose-950/80 dark:via-red-950/70 dark:to-pink-950/60 dark:border-rose-800/30',
          iconBg: 'from-rose-500 to-red-600',
          textColor: 'text-rose-700 dark:text-rose-400',
          progressColor: 'bg-gradient-to-r from-rose-500 to-red-600',
          decorativeColor: 'from-rose-200/30 to-red-300/20 dark:from-rose-800/20 dark:to-red-700/10'
        };
      default: 
        return {
          gradient: 'from-blue-50 via-indigo-50 to-violet-50 border-blue-100/50 dark:from-blue-950/80 dark:via-indigo-950/70 dark:to-violet-950/60 dark:border-blue-800/30',
          iconBg: 'from-blue-500 to-indigo-600',
          textColor: 'text-blue-700 dark:text-blue-400',
          progressColor: 'bg-gradient-to-r from-blue-500 to-indigo-600',
          decorativeColor: 'from-blue-200/30 to-indigo-300/20 dark:from-blue-800/20 dark:to-indigo-700/10'
        };
    }
  };
  
  const statusConfig = getStatusConfig();
  
  const getStatusIcon = () => {
    switch (status) {
      case 'active': return <CheckCircle className="h-5 w-5" />;
      case 'expiring': return <Clock className="h-5 w-5" />;
      case 'expired': return <AlertTriangle className="h-5 w-5" />;
      default: return <Calendar className="h-5 w-5" />;
    }
  };
  
  const getProgressPercentage = () => {
    try {
      const start = new Date(leaseStart).getTime();
      const end = new Date(leaseEnd).getTime();
      const now = new Date().getTime();
      const totalDuration = end - start;
      const elapsed = now - start;
      
      // If lease hasn't started yet
      if (elapsed < 0) return 0;
      // If lease has expired
      if (elapsed > totalDuration) return 100;
      
      return Math.min(100, Math.round((elapsed / totalDuration) * 100));
    } catch (e) {
      return 0;
    }
  };
  
  const progressPercentage = getProgressPercentage();
  
  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${statusConfig.gradient} border`}
    >
      {/* Decorative background element */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${statusConfig.decorativeColor} rounded-full -translate-y-16 translate-x-16`} />
      
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center">
            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${statusConfig.iconBg} text-white shadow-lg`}>
              {getStatusIcon()}
            </div>
            <div className="ml-3">
              <h3 className={`font-bold text-lg ${statusConfig.textColor}`}>
                {status === 'active' && t('leaseStatusActive')}
                {status === 'expiring' && t('leaseStatusExpiringDays', { days: daysLeft.toString() })}
                {status === 'expired' && t('leaseStatusExpired', { days: daysLeft.toString() })}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {status === 'active' && 'Bail en cours'}
                {status === 'expiring' && 'Expiration prochaine'}
                {status === 'expired' && 'Bail expiré'}
              </p>
            </div>
          </div>
          {status === 'expired' && (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: [0.8, 1.1, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse", repeatDelay: 3 }}
              className="bg-red-500 text-white text-xs rounded-full px-3 py-1 font-semibold shadow-md"
            >
              Expiré !
            </motion.div>
          )}
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/70 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100/50 dark:border-gray-700/30">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('lease.start')}</div>
              <div className="font-semibold text-gray-800 dark:text-gray-200">
                {new Date(leaseStart).toLocaleDateString('fr-FR')}
              </div>
            </div>
            <div className="bg-white/70 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100/50 dark:border-gray-700/30">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('lease.end')}</div>
              <div className="font-semibold text-gray-800 dark:text-gray-200">
                {new Date(leaseEnd).toLocaleDateString('fr-FR')}
              </div>
            </div>
          </div>
          
          <div className="bg-white/60 dark:bg-gray-800/40 rounded-xl p-4 border border-gray-100/50 dark:border-gray-700/30">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progression du bail</span>
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">{progressPercentage}%</span>
            </div>
            
            <div className="w-full bg-gray-200/70 dark:bg-gray-700/70 rounded-full h-3 mb-3 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                className={`h-3 rounded-full ${statusConfig.progressColor} shadow-sm`}
              />
            </div>
            
            <div className="flex items-center justify-center">
              {status === 'active' && (
                <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">{t('daysLeft', { days: daysLeft.toString() })}</span>
                </div>
              )}
              {status === 'expiring' && (
                <div className="flex items-center text-amber-600 dark:text-amber-400">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">{t('daysLeft', { days: daysLeft.toString() })}</span>
                </div>
              )}
              {status === 'expired' && (
                <div className="flex items-center text-rose-600 dark:text-rose-400">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">{t('daysAgo', { days: daysLeft.toString() })}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
