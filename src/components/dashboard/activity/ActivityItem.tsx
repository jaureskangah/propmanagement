
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { LucideIcon } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { motion } from "framer-motion";

interface ActivityItemProps {
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  title: string;
  description: string;
  date: string;
}

export const ActivityItem = ({ 
  icon: Icon,
  iconColor,
  iconBgColor,
  title,
  description,
  date 
}: ActivityItemProps) => {
  const { language } = useLocale();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="flex items-center gap-4 rounded-lg border p-4 transition-all hover:border-primary/30 hover:bg-muted/80 group"
    >
      <div className={`rounded-full ${iconBgColor} p-2 shadow-md group-hover:scale-110 transition-transform duration-200`}>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>
      <div className="flex-1">
        <p className="font-medium group-hover:text-primary transition-colors">{title}</p>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      <p className="text-sm text-muted-foreground whitespace-nowrap">
        {formatDistanceToNow(new Date(date), { 
          addSuffix: true,
          locale: language === 'fr' ? fr : undefined
        })}
      </p>
    </motion.div>
  );
};
