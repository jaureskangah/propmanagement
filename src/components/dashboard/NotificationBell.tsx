
import { Button } from "@/components/ui/button";
import { Bell, MessageSquare, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocale } from "@/components/providers/LocaleProvider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface NotificationBellProps {
  unreadCount: number;
  unreadMessages: any[];
  maintenanceRequests: any[];
  onShowAllNotifications: () => void;
}

export const NotificationBell = ({ 
  unreadCount, 
  unreadMessages = [], 
  maintenanceRequests = [],
  onShowAllNotifications
}: NotificationBellProps) => {
  const navigate = useNavigate();
  const { t } = useLocale();
  
  // Ne rien afficher s'il n'y a pas de notifications
  if (unreadCount === 0) return null;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute -top-12 right-0 h-12 w-12 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-300 dark:bg-gray-800",
              "border border-purple-100 hover:border-purple-200 dark:border-purple-900"
            )}
            aria-label={`${unreadCount} unread notifications`}
          >
            <Bell className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span 
                  initial={{ scale: 0.5 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.3, repeat: 3, repeatType: "reverse" }}
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-purple-600 text-[11px] text-white flex items-center justify-center"
                >
                  {unreadCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-72" align="end">
          <div className="flex items-center justify-between px-3 py-2">
            <h4 className="font-medium text-sm">{t('notificationCenter')}</h4>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs"
              onClick={onShowAllNotifications}
            >
              {t('viewAll')}
            </Button>
          </div>
          
          <DropdownMenuSeparator />
          
          <ScrollArea className="h-64">
            <DropdownMenuGroup>
              {unreadMessages.length > 0 && (
                <>
                  <div className="px-3 py-1">
                    <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground mb-1">
                      <MessageSquare className="h-3 w-3" />
                      {t('unreadMessages')} 
                      <Badge variant="outline" className="ml-auto text-[10px] h-4">{unreadMessages.length}</Badge>
                    </div>
                  </div>
                  
                  {unreadMessages.slice(0, 3).map((message) => (
                    <DropdownMenuItem key={message.id} asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-start cursor-pointer px-3 py-2 h-auto"
                        onClick={() => navigate(`/tenants?selected=${message.tenants?.id}&tab=communications`)}
                      >
                        <div className="flex flex-col w-full text-left">
                          <span className="font-medium text-xs">
                            {message.tenants?.name} ({t("unit")} {message.tenants?.unit_number})
                          </span>
                          <span className="text-xs text-muted-foreground line-clamp-1">
                            {message.subject}
                          </span>
                        </div>
                      </Button>
                    </DropdownMenuItem>
                  ))}
                  
                  {unreadMessages.length > 3 && (
                    <div className="px-3 py-1">
                      <Button 
                        variant="link" 
                        className="w-full h-8 text-xs"
                        onClick={() => navigate('/tenants')}
                      >
                        +{unreadMessages.length - 3} {t('more')}...
                      </Button>
                    </div>
                  )}
                  
                  <DropdownMenuSeparator />
                </>
              )}
              
              {maintenanceRequests.length > 0 && (
                <>
                  <div className="px-3 py-1">
                    <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground mb-1">
                      <Wrench className="h-3 w-3" />
                      {t('maintenanceRequests')}
                      <Badge variant="outline" className="ml-auto text-[10px] h-4">{maintenanceRequests.length}</Badge>
                    </div>
                  </div>
                  
                  {maintenanceRequests.slice(0, 3).map((request) => (
                    <DropdownMenuItem key={request.id} asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-start cursor-pointer px-3 py-2 h-auto"
                        onClick={() => navigate('/maintenance')}
                      >
                        <div className="flex flex-col w-full text-left">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-xs">
                              {request.tenants?.name} ({t("unit")} {request.tenants?.unit_number})
                            </span>
                            <Badge 
                              variant={request.priority === "Urgent" ? "destructive" : "outline"} 
                              className="ml-1 text-[10px] h-4"
                            >
                              {request.priority}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground line-clamp-1">
                            {request.issue}
                          </span>
                        </div>
                      </Button>
                    </DropdownMenuItem>
                  ))}
                  
                  {maintenanceRequests.length > 3 && (
                    <div className="px-3 py-1">
                      <Button 
                        variant="link" 
                        className="w-full h-8 text-xs"
                        onClick={() => navigate('/maintenance')}
                      >
                        +{maintenanceRequests.length - 3} {t('more')}...
                      </Button>
                    </div>
                  )}
                </>
              )}
              
              {unreadMessages.length === 0 && maintenanceRequests.length === 0 && (
                <div className="px-3 py-4 text-center text-muted-foreground">
                  {t('noNotifications')}
                </div>
              )}
            </DropdownMenuGroup>
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
};
