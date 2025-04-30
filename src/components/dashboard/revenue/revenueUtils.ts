
// Define the type for monthly data
interface MonthlyDataItem {
  month: string;
  amount: number;
  income: number;
  expenses: number;
  expense: number;
  profit?: number; // Make profit optional so we can add it later
}

export const processMonthlyData = (expenses = [], payments = [], year = new Date().getFullYear()) => {
  // Initialiser le tableau des mois
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

  // Traiter les paiements
  payments.forEach(payment => {
    try {
      const date = new Date(payment.payment_date);
      if (date.getFullYear() === year) {
        const monthIndex = date.getMonth();
        const paymentAmount = Number(payment.amount) || 0;
        
        // S'assurer que l'indice est valide
        if (monthIndex >= 0 && monthIndex < 12) {
          monthlyData[monthIndex].amount += paymentAmount;
          monthlyData[monthIndex].income += paymentAmount;
        }
      }
    } catch (error) {
      console.error("Error processing payment:", error, payment);
    }
  });

  // Traiter les dépenses
  expenses.forEach(expense => {
    try {
      const date = new Date(expense.date);
      if (date.getFullYear() === year) {
        const monthIndex = date.getMonth();
        const amount = expense.amount || expense.cost || 0;
        const expenseAmount = Number(amount) || 0;
        
        // S'assurer que l'indice est valide
        if (monthIndex >= 0 && monthIndex < 12) {
          monthlyData[monthIndex].expenses += expenseAmount;
          monthlyData[monthIndex].expense += expenseAmount;
        }
      }
    } catch (error) {
      console.error("Error processing expense:", error, expense);
    }
  });

  // Calculer le profit pour chaque mois
  monthlyData.forEach(monthData => {
    monthData.profit = monthData.amount - monthData.expenses;
  });

  console.log("Generated monthly data:", monthlyData);
  return monthlyData;
};
