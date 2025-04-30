
export const processMonthlyData = (expenses = [], payments = [], year = new Date().getFullYear()) => {
  // Initialiser le tableau des mois
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(year, i).toLocaleString('default', { month: 'short' });
    return {
      month,
      amount: 0,
      expenses: 0
    };
  });

  console.log("Processing monthly data with:", { 
    expensesCount: expenses.length, 
    paymentsCount: payments.length,
    year
  });

  // Traiter les paiements
  payments.forEach(payment => {
    const date = new Date(payment.payment_date);
    if (date.getFullYear() === year) {
      const monthIndex = date.getMonth();
      monthlyData[monthIndex].amount += Number(payment.amount);
    }
  });

  // Traiter les dépenses
  expenses.forEach(expense => {
    const date = new Date(expense.date);
    if (date.getFullYear() === year) {
      const monthIndex = date.getMonth();
      const amount = expense.amount || expense.cost || 0;
      monthlyData[monthIndex].expenses += Number(amount);
    }
  });

  console.log("Generated monthly data:", monthlyData);
  return monthlyData;
};
