
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Mail, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link } from 'react-router-dom';

interface RecentReminder {
  id: string;
  target_month: string;
  status: string;
  created_at: string;
  tenants: {
    name: string;
  };
}

export const RentRemindersWidget = () => {
  const [recentReminders, setRecentReminders] = useState<RecentReminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentReminders();
  }, []);

  const fetchRecentReminders = async () => {
    try {
      const { data, error } = await supabase
        .from('rent_payment_reminders')
        .select(`
          id,
          target_month,
          status,
          created_at,
          tenants!inner(name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      setRecentReminders(data || []);
    } catch (error) {
      console.error('Error fetching recent reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextReminderDate = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Si nous sommes après le 24, le prochain rappel sera le 24 du mois suivant
    const nextMonth = now.getDate() > 24 ? currentMonth + 1 : currentMonth;
    const nextYear = nextMonth > 11 ? currentYear + 1 : currentYear;
    const adjustedMonth = nextMonth > 11 ? 0 : nextMonth;
    
    return new Date(nextYear, adjustedMonth, 24);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Rappels de loyer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Prochain envoi automatique */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Prochain envoi automatique</span>
          </div>
          <span className="text-sm text-blue-600">
            {format(nextReminderDate(), 'dd MMM yyyy', { locale: fr })}
          </span>
        </div>

        {/* Rappels récents */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Rappels récents</h4>
          {recentReminders.length === 0 ? (
            <p className="text-sm text-gray-500">Aucun rappel envoyé récemment</p>
          ) : (
            <div className="space-y-2">
              {recentReminders.map((reminder) => (
                <div key={reminder.id} className="flex items-center justify-between text-sm">
                  <span className="truncate">{reminder.tenants.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={reminder.status === 'sent' ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {reminder.status === 'sent' ? 'Envoyé' : 'Échec'}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {format(new Date(reminder.created_at), 'dd/MM', { locale: fr })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lien vers la gestion complète */}
        <div className="pt-2 border-t">
          <Link to="/rent-reminders">
            <Button variant="outline" size="sm" className="w-full">
              Gérer les rappels
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
