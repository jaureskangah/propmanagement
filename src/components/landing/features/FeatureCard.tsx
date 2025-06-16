
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { itemVariants } from "./featuresAnimations";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <motion.div 
      variants={itemVariants}
      whileHover={{ 
        y: -10, 
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: { duration: 0.3 }
      }}
      className="bg-white/80 backdrop-blur-lg p-6 rounded-xl border border-red-100 shadow-lg transition-all duration-300 group"
    >
      <motion.div 
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.15, rotate: 5 }}
        transition={{ type: "spring" as const, stiffness: 300, damping: 10 }}
        className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mb-4"
      >
        {icon}
      </motion.div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </motion.div>
  );
}
