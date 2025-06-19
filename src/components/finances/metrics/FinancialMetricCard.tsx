
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendIndicator } from "../TrendIndicator";
import { MetricIcon } from "./MetricIcon";
import { FinancialMetricCardProps } from "./types";
import { motion } from "framer-motion";

export function FinancialMetricCard({
  title,
  value,
  description,
  icon,
  chartColor,
  trend,
  isNegativeBetter,
  format
}: FinancialMetricCardProps) {
  // Determine if an increase is positive or negative based on the metric
  const isPositiveMetric = !isNegativeBetter;
  
  // Enhanced gradient mappings for different metric types
  const getGradientStyles = () => {
    if (chartColor === '#22C55E') {
      return {
        bgGradient: "from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-900/30 dark:via-green-900/20 dark:to-teal-900/10",
        borderColor: "border-emerald-200/60 dark:border-emerald-700/40",
        hoverBorder: "hover:border-emerald-300/80 dark:hover:border-emerald-600/60",
        shadowColor: "shadow-emerald-100/50 dark:shadow-emerald-900/20",
        hoverShadow: "hover:shadow-emerald-200/60 dark:hover:shadow-emerald-800/30"
      };
    } else if (chartColor === '#F59E0B') {
      return {
        bgGradient: "from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-900/30 dark:via-yellow-900/20 dark:to-orange-900/10",
        borderColor: "border-amber-200/60 dark:border-amber-700/40",
        hoverBorder: "hover:border-amber-300/80 dark:hover:border-amber-600/60",
        shadowColor: "shadow-amber-100/50 dark:shadow-amber-900/20",
        hoverShadow: "hover:shadow-amber-200/60 dark:hover:shadow-amber-800/30"
      };
    } else if (chartColor === '#EF4444') {
      return {
        bgGradient: "from-red-50 via-rose-50 to-pink-50 dark:from-red-900/30 dark:via-rose-900/20 dark:to-pink-900/10",
        borderColor: "border-red-200/60 dark:border-red-700/40",
        hoverBorder: "hover:border-red-300/80 dark:hover:border-red-600/60",
        shadowColor: "shadow-red-100/50 dark:shadow-red-900/20",
        hoverShadow: "hover:shadow-red-200/60 dark:hover:shadow-red-800/30"
      };
    } else {
      return {
        bgGradient: "from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/30 dark:via-indigo-900/20 dark:to-purple-900/10",
        borderColor: "border-blue-200/60 dark:border-blue-700/40",
        hoverBorder: "hover:border-blue-300/80 dark:hover:border-blue-600/60",
        shadowColor: "shadow-blue-100/50 dark:shadow-blue-900/20",
        hoverShadow: "hover:shadow-blue-200/60 dark:hover:shadow-blue-800/30"
      };
    }
  };

  const gradientStyles = getGradientStyles();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.2 }
      }}
      className="group"
    >
      <Card className={`
        relative overflow-hidden transition-all duration-500 
        bg-gradient-to-br ${gradientStyles.bgGradient}
        border-2 ${gradientStyles.borderColor} ${gradientStyles.hoverBorder}
        shadow-lg ${gradientStyles.shadowColor} ${gradientStyles.hoverShadow}
        hover:shadow-xl backdrop-blur-sm
        transform-gpu
      `}>
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out" />
        </div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <CardContent className="relative p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <div className={`
                  h-12 w-12 rounded-xl flex items-center justify-center 
                  bg-white/90 dark:bg-gray-800/80 shadow-lg
                  ring-2 ring-white/50 dark:ring-gray-700/50
                  backdrop-blur-sm
                  group-hover:shadow-xl transition-all duration-300
                `}>
                  <MetricIcon icon={icon} chartColor={chartColor} />
                </div>
                {/* Icon glow effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
              
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors duration-300">
                  {title}
                </h3>
                {trend !== undefined && (
                  <TrendIndicator trend={trend} isPositiveMetric={isPositiveMetric} />
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <motion.div 
              className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent group-hover:from-slate-900 dark:group-hover:from-slate-50 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {value}
            </motion.div>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors duration-300 leading-relaxed">
              {description}
            </p>
          </div>
          
          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-20 group-hover:opacity-40 transition-opacity duration-300" 
               style={{ color: chartColor }} />
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function FinancialMetricSkeleton() {
  return (
    <Card className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-3 w-32" />
      </div>
    </Card>
  );
}
