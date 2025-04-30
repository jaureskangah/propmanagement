
// Define the type for monthly data
interface MonthlyDataItem {
  month: string;
  amount: number;
  income: number;
  expenses: number;
  expense: number;
  profit?: number; // Make profit optional so we can add it later
}

export const processMonthlyData = (payments = [], expenses = [], year = new Date().getFullYear()) => {
  // Initialiser le tableau des mois
  const monthlyData: MonthlyDataItem[] = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(year, i).toLocaleString('default', { month: 'short' });
    return {
      month,
      amount: 0,  // pour compatibilité avec les anciens composants
      income: 0,  // pour compatibilité avec les nouveaux composants
      expenses: 0, // pour compatibilité avec les anciens composants
      expense: 0   // pour compatibilité avec les nouveaux composants
    };
  });

  console.log("Processing monthly data with:", { 
    paymentsCount: payments.length, 
    expensesCount: expenses.length,
    year
  });

  // Traiter les paiements
  payments.forEach(payment => {
    const date = new Date(payment.payment_date);
    if (date.getFullYear() === year) {
      const monthIndex = date.getMonth();
      const paymentAmount = Number(payment.amount);
      monthlyData[monthIndex].amount += paymentAmount;
      monthlyData[monthIndex].income += paymentAmount;
    }
  });

  // Traiter les dépenses
  expenses.forEach(expense => {
    const date = new Date(expense.date);
    if (date.getFullYear() === year) {
      const monthIndex = date.getMonth();
      const amount = expense.amount || expense.cost || 0;
      const expenseAmount = Number(amount);
      monthlyData[monthIndex].expenses += expenseAmount;
      monthlyData[monthIndex].expense += expenseAmount;
    }
  });

  // Ajouter la propriété profit pour être cohérent avec la page Finances
  monthlyData.forEach(monthData => {
    monthData.profit = monthData.amount - monthData.expenses;
  });

  console.log("Generated monthly data:", monthlyData);
  return monthlyData;
};
