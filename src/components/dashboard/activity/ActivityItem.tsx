
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { LucideIcon } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

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
  const { locale } = useLocale();

  return (
    <div className="flex items-center gap-4 rounded-lg border p-4 transition-all hover:bg-muted/50">
      <div className={`rounded-full ${iconBgColor} p-2`}>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </div>
      <div className="flex-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      <p className="text-sm text-muted-foreground">
        {formatDistanceToNow(new Date(date), { 
          addSuffix: true,
          locale: locale === 'fr' ? fr : undefined
        })}
      </p>
    </div>
  );
};
