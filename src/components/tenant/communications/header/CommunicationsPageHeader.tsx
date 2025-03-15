
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CommunicationsPageHeaderProps {
  onNewMessageClick: () => void;
  onInviteTenantClick: () => void;
}

export const CommunicationsPageHeader = ({
  onNewMessageClick,
  onInviteTenantClick,
}: CommunicationsPageHeaderProps) => {
  const { t } = useLocale();

  return (
    <div className="mb-8 bg-gradient-to-r from-background to-muted/30 backdrop-blur-sm p-6 rounded-xl border border-border/40 shadow-sm dark:border-gray-700/40 dark:from-gray-900 dark:to-gray-800/30">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center dark:bg-primary/20">
              <MessageSquare 
                className="h-6 w-6 text-primary dark:text-primary/90"
              />
            </div>
            <div className="space-y-1.5">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent font-sans dark:from-blue-400 dark:to-blue-600">
                {t('communications')}
              </h1>
              <p className="text-muted-foreground text-sm font-sans dark:text-gray-400">
                {t('communicationsDescription', { fallback: t('managePropertyCommunications') })}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline"
                  onClick={onInviteTenantClick}
                  className="flex items-center gap-2 hover:bg-primary/10 transition-colors"
                >
                  {t('inviteTenant')}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {t('inviteTenantDescription', { fallback: t('inviteTenantTooltip') })}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={onNewMessageClick}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  {t('newMessage')}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {t('sendNewMessage')}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};
