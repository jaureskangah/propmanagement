import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { NotificationsList } from "./NotificationsList";

interface Notification {
  id: string;
  title: string;
  issue: string;
  priority: string;
  deadline?: string;
  created_at: string;
}

export const MaintenanceNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching notifications:', error);
        return;
      }

      setNotifications(data);
    };

    fetchNotifications();

    const channel = supabase
      .channel('maintenance-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'maintenance_requests'
        },
        (payload: RealtimePostgresChangesPayload<Notification>) => {
          console.log('Real-time update:', payload);
          const newNotification = payload.new as Notification;
          if (newNotification?.title) {
            toast({
              title: "Nouvelle demande de maintenance",
              description: newNotification.title,
            });
            fetchNotifications();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications et Alertes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <NotificationsList notifications={notifications} />
      </CardContent>
    </Card>
  );
};