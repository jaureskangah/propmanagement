
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, AlertTriangle, Clock, Mail, MessageSquare } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

interface TypeFilterProps {
  value: string | null;
  onChange: (value: string) => void;
  types: string[];
}

export const TypeFilter = ({ value, onChange, types }: TypeFilterProps) => {
  const { t } = useLocale();
  
  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'urgent':
        return <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />;
      case 'maintenance':
        return <Clock className="h-4 w-4 text-yellow-500 mr-2" />;
      case 'email':
        return <Mail className="h-4 w-4 text-blue-500 mr-2" />;
      case 'message':
        return <MessageSquare className="h-4 w-4 text-green-500 mr-2" />;
      default:
        return <MessageSquare className="h-4 w-4 text-muted-foreground mr-2" />;
    }
  };

  return (
    <div className="flex-shrink-0 min-w-[180px]">
      <Select 
        value={value || "all"} 
        onValueChange={(val) => onChange(val === "all" ? null : val)}
      >
        <SelectTrigger className="h-9">
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder={t('filter')} />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground" />
              {t('allMessages')}
            </div>
          </SelectItem>
          {types.map((type) => (
            type && (
              <SelectItem key={type} value={type}>
                <div className="flex items-center">
                  {getTypeIcon(type)}
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </div>
              </SelectItem>
            )
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
