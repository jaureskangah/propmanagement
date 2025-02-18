
export const processMonthlyData = (expenses: any[] = [], payments: any[] = []) => {
  return new Array(12).fill(0).map((_, index) => {
    const month = new Date(2024, index).toLocaleString('en-US', { month: 'short' });
    
    // Calculate total revenue (payments) for the month
    const monthlyRevenue = payments?.reduce((acc, payment) => {
      const paymentMonth = new Date(payment.payment_date).getMonth();
      if (paymentMonth === index) {
        return acc + Number(payment.amount);
      }
      return acc;
    }, 0) || 0;

    // Calculate total expenses for the month
    const monthlyExpenses = expenses?.reduce((acc, expense) => {
      const expenseMonth = new Date(expense.date).getMonth();
      if (expenseMonth === index) {
        return acc + Number(expense.amount);
      }
      return acc;
    }, 0) || 0;

    return {
      month,
      amount: monthlyRevenue,
      expenses: monthlyExpenses,
      profit: monthlyRevenue - monthlyExpenses,
    };
  });
};
