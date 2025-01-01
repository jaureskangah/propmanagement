import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

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

export const useMaintenanceAlerts = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [budgetAlerts, setBudgetAlerts] = useState<BudgetAlert[]>([]);
  const { toast } = useToast();

  const generateBudgetAlerts = (budgetData: any[], expensesData: any[]) => {
    const alerts: BudgetAlert[] = [];

    budgetData?.forEach((budget) => {
      const budgetExpenses = expensesData?.filter(expense => 
        expense.property_id === budget.property_id
      ) || [];

      const totalExpenses = budgetExpenses.reduce(
        (sum, expense) => sum + (expense.amount || 0),
        0
      );

      if (totalExpenses > budget.amount) {
        alerts.push({
          id: `budget-${budget.id}`,
          title: "Dépassement de Budget",
          issue: `Le budget de maintenance (${budget.amount}€) a été dépassé de ${(totalExpenses - budget.amount).toLocaleString()}€`,
          priority: "high",
          type: 'budget'
        });
      }

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

    return alerts;
  };

  const generatePaymentAlerts = () => {
    const alerts: BudgetAlert[] = [];
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    
    const recurringPayments = [
      { title: "Assurance", amount: 1200, dueDate: nextMonth },
      { title: "Maintenance HVAC", amount: 500, dueDate: nextMonth }
    ];

    recurringPayments.forEach(payment => {
      if (payment.dueDate.getTime() - today.getTime() < 15 * 24 * 60 * 60 * 1000) {
        alerts.push({
          id: `payment-${payment.title}`,
          title: "Paiement Récurrent à Venir",
          issue: `${payment.title} - ${payment.amount}€ à payer avant le ${payment.dueDate.toLocaleDateString()}`,
          priority: "medium",
          type: 'payment'
        });
      }
    });

    return alerts;
  };

  const fetchNotifications = async () => {
    const { data: maintenanceData, error: maintenanceError } = await supabase
      .from('maintenance_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (maintenanceError) {
      console.error('Error fetching maintenance notifications:', maintenanceError);
      return;
    }

    const { data: budgetData, error: budgetError } = await supabase
      .from('maintenance_budgets')
      .select('*');

    if (budgetError) {
      console.error('Error fetching budget data:', budgetError);
      return;
    }

    const { data: expensesData, error: expensesError } = await supabase
      .from('maintenance_expenses')
      .select('*');

    if (expensesError) {
      console.error('Error fetching expenses data:', expensesError);
      return;
    }

    const budgetAlerts = generateBudgetAlerts(budgetData || [], expensesData || []);
    const paymentAlerts = generatePaymentAlerts();

    setNotifications(maintenanceData || []);
    setBudgetAlerts([...budgetAlerts, ...paymentAlerts]);
  };

  useEffect(() => {
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

  return { notifications, budgetAlerts };
};