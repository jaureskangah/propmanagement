import { useEffect, useState } from "react";
import { Bell, AlertTriangle, CreditCard, TrendingUp } from "lucide-react";
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

interface BudgetAlert {
  id: string;
  title: string;
  issue: string;
  priority: string;
  type: 'budget' | 'payment' | 'unusual';
}

export const MaintenanceNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [budgetAlerts, setBudgetAlerts] = useState<BudgetAlert[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNotifications = async () => {
      // Récupérer les demandes de maintenance
      const { data: maintenanceData, error: maintenanceError } = await supabase
        .from('maintenance_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (maintenanceError) {
        console.error('Error fetching maintenance notifications:', maintenanceError);
        return;
      }

      // Récupérer les budgets
      const { data: budgetData, error: budgetError } = await supabase
        .from('maintenance_budgets')
        .select('*');

      if (budgetError) {
        console.error('Error fetching budget data:', budgetError);
        return;
      }

      // Récupérer les dépenses séparément
      const { data: expensesData, error: expensesError } = await supabase
        .from('maintenance_expenses')
        .select('*');

      if (expensesError) {
        console.error('Error fetching expenses data:', expensesError);
        return;
      }

      // Analyser les données pour générer les alertes
      const alerts: BudgetAlert[] = [];

      budgetData?.forEach((budget) => {
        // Calculer les dépenses totales pour ce budget
        const budgetExpenses = expensesData?.filter(expense => 
          expense.property_id === budget.property_id
        ) || [];

        const totalExpenses = budgetExpenses.reduce(
          (sum, expense) => sum + (expense.amount || 0),
          0
        );

        // Alerte de dépassement de budget
        if (totalExpenses > budget.amount) {
          alerts.push({
            id: `budget-${budget.id}`,
            title: "Dépassement de Budget",
            issue: `Le budget de maintenance (${budget.amount}€) a été dépassé de ${(totalExpenses - budget.amount).toLocaleString()}€`,
            priority: "high",
            type: 'budget'
          });
        }

        // Alerte pour coûts inhabituels (20% au-dessus de la moyenne)
        if (budgetExpenses.length > 0) {
          const averageExpense = totalExpenses / budgetExpenses.length;
          const unusualExpenses = budgetExpenses.filter(
            expense => expense.amount > averageExpense * 1.2
          );

          unusualExpenses.forEach(expense => {
            alerts.push({
              id: `unusual-${expense.category}`,
              title: "Coût Inhabituel Détecté",
              issue: `Dépense inhabituelle de ${expense.amount.toLocaleString()}€ dans la catégorie ${expense.category}`,
              priority: "medium",
              type: 'unusual'
            });
          });
        }
      });

      // Vérifier les paiements récurrents à venir
      const today = new Date();
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      
      // Exemple avec des paiements récurrents (à adapter selon vos besoins)
      const recurringPayments = [
        { title: "Assurance", amount: 1200, dueDate: nextMonth },
        { title: "Maintenance HVAC", amount: 500, dueDate: nextMonth }
      ];

      recurringPayments.forEach(payment => {
        if (payment.dueDate.getTime() - today.getTime() < 15 * 24 * 60 * 60 * 1000) { // 15 jours
          alerts.push({
            id: `payment-${payment.title}`,
            title: "Paiement Récurrent à Venir",
            issue: `${payment.title} - ${payment.amount}€ à payer avant le ${payment.dueDate.toLocaleDateString()}`,
            priority: "medium",
            type: 'payment'
          });
        }
      });

      setNotifications(maintenanceData || []);
      setBudgetAlerts(alerts);
    };

    fetchNotifications();

    // Écouter les mises à jour en temps réel
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

  // Combiner les notifications de maintenance et les alertes de budget
  const allNotifications = [
    ...budgetAlerts.map(alert => ({
      ...alert,
      icon: alert.type === 'budget' ? AlertTriangle : 
            alert.type === 'payment' ? CreditCard : TrendingUp
    })),
    ...notifications.map(notif => ({
      ...notif,
      icon: Bell
    }))
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications et Alertes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <NotificationsList notifications={allNotifications} />
      </CardContent>
    </Card>
  );
};