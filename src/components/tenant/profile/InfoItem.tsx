
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/LocaleProvider";

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
  copyable?: boolean;
}

export const InfoItem = ({ 
  icon, 
  label, 
  value, 
  highlight = false,
  copyable = false 
}: InfoItemProps) => {
  const { t } = useLocale();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    
    toast({
      title: t('copied') || "Copié",
      description: `${label}: ${value}`,
      duration: 2000
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-card rounded-lg border p-4">
      <div className="flex items-center gap-2 text-muted-foreground mb-1.5">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
      </div>
      
      <div className="flex items-center justify-between">
        <p className={cn(
          "font-medium text-sm",
          highlight && "text-amber-600 dark:text-amber-400"
        )}>
          {value || "-"}
        </p>
        
        {copyable && value && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleCopy}
            className="h-7 w-7 p-0 rounded-full"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="sr-only">Copier {label}</span>
          </Button>
        )}
      </div>
    </div>
  );
};
