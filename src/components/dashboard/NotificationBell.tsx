
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/components/providers/LocaleProvider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UnreadMessagesDialog } from "./UnreadMessagesDialog";

interface NotificationBellProps {
  unreadCount?: number;
}

export const NotificationBell = ({ unreadCount: propUnreadCount }: NotificationBellProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { t } = useLocale();
  const { toast } = useToast();

  // Fetch unread tenant communications
  const { data: unreadMessages = [], refetch } = useQuery({
    queryKey: ['unread_tenant_messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenant_communications')
        .select(`
          *,
          tenants (
            id,
            name,
            unit_number
          )
        `)
        .eq('status', 'unread')
        .eq('is_from_tenant', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching unread messages:", error);
        toast({
          title: t('error'),
          description: t('errorFetchingMessages'),
          variant: "destructive",
        });
        return [];
      }

      return data || [];
    },
    staleTime: 1000 * 60, // 1 minute
    refetchInterval: 1000 * 60 * 2 // Refresh every 2 minutes
  });

  // Real-time subscription to unread messages
  useEffect(() => {
    const channel = supabase
      .channel('unread-messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tenant_communications',
          filter: 'status=eq.unread',
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const unreadCount = propUnreadCount !== undefined ? propUnreadCount : unreadMessages.length;

  if (unreadCount === 0) return null;

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDialogOpen(true)}
              className={cn(
                "relative h-10 w-10 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-300",
                "border border-purple-100 hover:border-purple-200"
              )}
            >
              <Bell className="h-5 w-5 text-purple-600" />
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-purple-600 text-[11px] text-white flex items-center justify-center">
                {unreadCount}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {t('unreadMessagesFromTenants', { fallback: 'You have unread messages from tenants' })}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <UnreadMessagesDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        unreadMessages={unreadMessages}
      />
    </>
  );
};
