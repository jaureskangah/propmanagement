
// Define the type for monthly data
interface MonthlyDataItem {
  month: string;
  amount: number;
  income: number;
  expenses: number;
  expense: number;
  profit: number; // Making profit required
}

export const processMonthlyData = (expenses = [], payments = [], year = new Date().getFullYear()) => {
  // Initialiser le tableau des mois avec toutes les données à 0
  const monthlyData: MonthlyDataItem[] = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(year, i).toLocaleString('default', { month: 'short' });
    return {
      month,
      amount: 0,  // pour compatibilité avec les anciens composants
      income: 0,  // pour compatibilité avec les nouveaux composants
      expenses: 0, // pour compatibilité avec les anciens composants
      expense: 0,  // pour compatibilité avec les nouveaux composants
      profit: 0    // profit initialisé à 0
    };
  });

  console.log("Processing monthly data with:", { 
    paymentsCount: payments.length, 
    expensesCount: expenses.length,
    year
  });

  // Optimisation: traiter en une seule boucle pour améliorer les performances
  const monthlyPayments = new Map<number, number>();
  const monthlyExpenses = new Map<number, number>();
  
  // Pré-traitement des paiements pour optimiser
  payments.forEach(payment => {
    try {
      const date = new Date(payment.payment_date);
      if (date.getFullYear() === year) {
        const monthIndex = date.getMonth();
        const paymentAmount = Number(payment.amount) || 0;
        
        if (monthIndex >= 0 && monthIndex < 12) {
          const currentAmount = monthlyPayments.get(monthIndex) || 0;
          monthlyPayments.set(monthIndex, currentAmount + paymentAmount);
        }
      }
    } catch (error) {
      console.error("Error processing payment:", error, payment);
    }
  });
  
  // Pré-traitement des dépenses pour optimiser
  expenses.forEach(expense => {
    try {
      const date = new Date(expense.date);
      if (date.getFullYear() === year) {
        const monthIndex = date.getMonth();
        const amount = expense.amount || expense.cost || 0;
        const expenseAmount = Number(amount) || 0;
        
        if (monthIndex >= 0 && monthIndex < 12) {
          const currentAmount = monthlyExpenses.get(monthIndex) || 0;
          monthlyExpenses.set(monthIndex, currentAmount + expenseAmount);
        }
      }
    } catch (error) {
      console.error("Error processing expense:", error, expense);
    }
  });
  
  // Application des montants agrégés
  for (let i = 0; i < 12; i++) {
    if (monthlyPayments.has(i)) {
      const amount = monthlyPayments.get(i) || 0;
      monthlyData[i].amount = amount;
      monthlyData[i].income = amount;
    }
    
    if (monthlyExpenses.has(i)) {
      const amount = monthlyExpenses.get(i) || 0;
      monthlyData[i].expenses = amount;
      monthlyData[i].expense = amount;
    }
    
    // Calculer le profit
    monthlyData[i].profit = monthlyData[i].income - monthlyData[i].expense;
  }

  console.log("Generated monthly data:", monthlyData);
  return monthlyData;
};

// Fonction pour calculer les totaux annuels
export const calculateAnnualTotals = (monthlyData: MonthlyDataItem[]) => {
  return monthlyData.reduce(
    (totals, month) => {
      return {
        income: totals.income + month.income,
        expenses: totals.expenses + month.expense,
        profit: totals.profit + month.profit
      };
    },
    { income: 0, expenses: 0, profit: 0 }
  );
};

// Fonction pour formater les montants monétaires
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
