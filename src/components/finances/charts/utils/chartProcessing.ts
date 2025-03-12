
export const processMonthlyData = (payments: any[] = [], expenses: any[] = []) => {
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  return monthNames.map((month, index) => {
    const monthlyPayments = payments.filter(p => {
      const paymentDate = new Date(p.payment_date);
      return paymentDate.getMonth() === index;
    });
    
    const monthlyExpenses = expenses.filter(e => {
      const expenseDate = new Date(e.date);
      return expenseDate.getMonth() === index;
    });
    
    const income = monthlyPayments.reduce((sum, p) => sum + p.amount, 0);
    const expense = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
    
    return {
      name: month,
      income,
      expense,
      profit: income - expense
    };
  });
};

export const processYearlyData = (payments: any[] = [], expenses: any[] = []) => {
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 2, currentYear - 1, currentYear];
  
  return years.map(year => {
    const yearlyPayments = payments.filter(p => {
      const paymentDate = new Date(p.payment_date);
      return paymentDate.getFullYear() === year;
    });
    
    const yearlyExpenses = expenses.filter(e => {
      const expenseDate = new Date(e.date);
      return expenseDate.getFullYear() === year;
    });
    
    const income = yearlyPayments.reduce((sum, p) => sum + p.amount, 0);
    const expense = yearlyExpenses.reduce((sum, e) => sum + e.amount, 0);
    
    return {
      name: year.toString(),
      income,
      expense,
      profit: income - expense
    };
  });
};
