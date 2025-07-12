import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/components/providers/LocaleProvider';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface NotificationToastProps {
  notifications: {
    unreadMessages: any[];
    totalCount: number;
    showUnreadDialog: boolean;
    setShowUnreadDialog: (show: boolean) => void;
    markAllAsRead: () => void;
  };
  maintenanceRequests?: any[];
  leaseStatus?: { daysLeft: number; status: 'active' | 'expiring' | 'expired' };
}

export const RealtimeNotificationToast: React.FC<NotificationToastProps> = ({
  notifications,
  maintenanceRequests = [],
  leaseStatus
}) => {
  const { toast } = useToast();
  const { t } = useLocale();

  // Notifications pour échéances de bail
  useEffect(() => {
    if (!leaseStatus) return;

    const { daysLeft, status } = leaseStatus;

    // Alerte si le bail expire dans moins de 30 jours
    if (status === 'expiring' && daysLeft <= 30 && daysLeft > 0) {
      toast({
        title: t('leaseExpiring') || 'Bail bientôt expiré',
        description: t('leaseExpiresInDays') || `Votre bail expire dans ${daysLeft} jours`,
        action: (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              // Rediriger vers la section des paramètres ou documents
              window.location.href = '/tenant-dashboard?section=settings';
            }}
          >
            {t('viewDetails') || 'Voir détails'}
          </Button>
        ),
      });
    }

    // Alerte si le bail est expiré
    if (status === 'expired') {
      toast({
        title: t('leaseExpired') || 'Bail expiré',
        description: t('contactOwner') || 'Contactez votre propriétaire pour renouveler',
        variant: 'destructive',
        action: (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              window.location.href = '/tenant-dashboard?section=settings';
            }}
          >
            {t('contact') || 'Contacter'}
          </Button>
        ),
      });
    }
  }, [leaseStatus?.daysLeft, leaseStatus?.status, toast, t]);

  // Notifications pour demandes de maintenance urgentes
  useEffect(() => {
    const urgentRequests = maintenanceRequests.filter(
      req => req.priority === 'High' || req.priority === 'Critical'
    );

    urgentRequests.forEach(request => {
      if (request.status === 'Pending' || request.status === 'In Progress') {
        toast({
          title: t('urgentMaintenance') || 'Maintenance urgente',
          description: `${request.title || request.issue}`,
          action: (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                window.location.href = '/tenant-dashboard?section=maintenance';
              }}
            >
              {t('viewRequest') || 'Voir demande'}
            </Button>
          ),
        });
      }
    });
  }, [maintenanceRequests, toast, t]);

  return (
    <AnimatePresence>
      {notifications.showUnreadDialog && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 right-4 z-50 max-w-sm"
        >
          <Card className="border-purple-200 bg-white shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <Bell className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 mb-1">
                    {t('newMessages') || 'Nouveaux messages'}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {t('unreadMessagesCount') || `Vous avez ${notifications.unreadMessages.length} message(s) non lu(s)`}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        notifications.markAllAsRead();
                        notifications.setShowUnreadDialog(false);
                      }}
                      className="flex-1"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      {t('markAsRead') || 'Marquer comme lu'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => notifications.setShowUnreadDialog(false)}
                    >
                      {t('dismiss') || 'Ignorer'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};