import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useMaintenanceAlerts = () => {
  // Fetch notifications
  const { data: notifications = [] } = useQuery({
    queryKey: ['maintenance_notifications'],
    queryFn: async () => {
      const { data: maintenanceRequests, error } = await supabase
        .from('maintenance_requests')
        .select('*')
        .eq('status', 'Pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return maintenanceRequests.map(request => ({
        id: request.id,
        title: request.title || 'Maintenance Request',
        issue: request.issue,
        priority: request.priority.toLowerCase(),
        deadline: request.deadline,
        type: 'maintenance'
      }));
    }
  });

  // Fetch budget alerts
  const { data: budgetAlerts = [] } = useQuery({
    queryKey: ['budget_alerts'],
    queryFn: async () => {
      const { data: budgets, error } = await supabase
        .from('maintenance_budgets')
        .select('*, maintenance_expenses!maintenance_expenses_budget_id_fkey(amount)');

      if (error) throw error;

      return budgets.map(budget => {
        const totalExpenses = budget.maintenance_expenses?.reduce((sum: number, exp: any) => sum + exp.amount, 0) || 0;
        const remainingBudget = budget.amount - totalExpenses;
        
        return {
          id: budget.id,
          title: 'Budget Alert',
          issue: `Remaining budget for ${budget.year}: $${remainingBudget.toLocaleString()}`,
          priority: remainingBudget < budget.amount * 0.2 ? 'high' : 'medium',
          type: 'budget'
        };
      });
    }
  });

  // Fetch payment alerts
  const { data: paymentAlerts = [] } = useQuery({
    queryKey: ['payment_alerts'],
    queryFn: async () => {
      const { data: payments, error } = await supabase
        .from('tenant_payments')
        .select(`
          *,
          tenants (
            name,
            rent_amount
          )
        `)
        .eq('status', 'pending')
        .order('payment_date', { ascending: false });

      if (error) throw error;

      const today = new Date();
      return payments
        .filter((payment: any) => {
          const dueDate = new Date(payment.payment_date);
          return dueDate < today;
        })
        .map((payment: any) => ({
          id: payment.id,
          title: 'Late Payment Alert',
          issue: `${payment.tenants.name} is late on payment of $${payment.amount}`,
          priority: 'high',
          type: 'payment',
          deadline: payment.payment_date
        }));
    }
  });

  return {
    notifications,
    budgetAlerts,
    paymentAlerts
  };
};