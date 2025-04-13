
export const processMonthlyData = (payments: any[] = [], expenses: any[] = []) => {
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  // Create a map to store aggregated data for each month
  const monthlyData = monthNames.reduce((acc, month, index) => {
    acc[index] = { name: month, income: 0, expense: 0, profit: 0 };
    return acc;
  }, {} as Record<number, { name: string, income: number, expense: number, profit: number }>);
  
  // Process payments
  payments.forEach(payment => {
    if (!payment.payment_date) return;
    
    const paymentDate = new Date(payment.payment_date);
    const monthIndex = paymentDate.getMonth();
    
    // Only count paid payments toward income
    if (payment.status === 'paid') {
      monthlyData[monthIndex].income += Number(payment.amount) || 0;
    }
  });
  
  // Process expenses
  expenses.forEach(expense => {
    if (!expense.date) return;
    
    const expenseDate = new Date(expense.date);
    const monthIndex = expenseDate.getMonth();
    
    monthlyData[monthIndex].expense += Number(expense.amount || expense.cost || 0);
  });
  
  // Calculate profit for each month
  Object.values(monthlyData).forEach(month => {
    month.profit = month.income - month.expense;
  });
  
  console.log("Processed monthly data:", Object.values(monthlyData));
  return Object.values(monthlyData);
};

export const processYearlyData = (payments: any[] = [], expenses: any[] = []) => {
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 2, currentYear - 1, currentYear];
  
  // Create a map to store aggregated data for each year
  const yearlyData = years.reduce((acc, year) => {
    acc[year] = { name: year.toString(), income: 0, expense: 0, profit: 0 };
    return acc;
  }, {} as Record<number, { name: string, income: number, expense: number, profit: number }>);
  
  // Process payments
  payments.forEach(payment => {
    if (!payment.payment_date) return;
    
    const paymentDate = new Date(payment.payment_date);
    const year = paymentDate.getFullYear();
    
    // Only include years we're interested in
    if (!yearlyData[year]) return;
    
    // Only count paid payments toward income
    if (payment.status === 'paid') {
      yearlyData[year].income += Number(payment.amount) || 0;
    }
  });
  
  // Process expenses
  expenses.forEach(expense => {
    if (!expense.date) return;
    
    const expenseDate = new Date(expense.date);
    const year = expenseDate.getFullYear();
    
    // Only include years we're interested in
    if (!yearlyData[year]) return;
    
    yearlyData[year].expense += Number(expense.amount || expense.cost || 0);
  });
  
  // Calculate profit for each year
  Object.values(yearlyData).forEach(year => {
    year.profit = year.income - year.expense;
  });
  
  console.log("Processed yearly data:", Object.values(yearlyData));
  return Object.values(yearlyData);
};
