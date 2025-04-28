
interface FinancialData {
  expenses: any[];
  maintenance: any[];
  rentData: any[];
}

export const useFinancialCalculations = ({ expenses, maintenance, rentData }: FinancialData) => {
  const calculateROI = () => {
    try {
      if (!Array.isArray(expenses) || !Array.isArray(maintenance) || !Array.isArray(rentData)) {
        console.warn("Invalid data types for ROI calculation");
        return "0.00";
      }

      const totalExpenses = expenses
        .filter(expense => expense && typeof expense === 'object' && typeof expense.amount === 'number')
        .reduce((acc, curr) => acc + curr.amount, 0);
        
      const totalMaintenance = maintenance
        .filter(item => item && typeof item === 'object' && typeof item.cost === 'number')
        .reduce((acc, curr) => acc + curr.cost, 0);
      
      const totalIncome = rentData
        .filter(payment => payment && payment.status === "paid" && typeof payment.amount === 'number')
        .reduce((acc, curr) => acc + curr.amount, 0);
      
      if (isNaN(totalIncome) || isNaN(totalExpenses) || isNaN(totalMaintenance)) {
        return "0.00";
      }
      
      const propertyValue = 500000;
      const netIncome = totalIncome - totalExpenses - totalMaintenance;
      
      const roi = ((netIncome / propertyValue) * 100);
      return isNaN(roi) ? "0.00" : roi.toFixed(2);
    } catch (error) {
      console.error("Error calculating ROI:", error);
      return "0.00";
    }
  };

  const calculateTotalExpenses = () => {
    try {
      if (!Array.isArray(expenses) || !Array.isArray(maintenance)) {
        return 0;
      }

      const expensesTotal = expenses
        .filter(expense => expense && typeof expense === 'object' && typeof expense.amount === 'number')
        .reduce((acc, curr) => acc + curr.amount, 0);

      const maintenanceTotal = maintenance
        .filter(item => item && typeof item === 'object' && typeof item.cost === 'number')
        .reduce((acc, curr) => acc + curr.cost, 0);

      return expensesTotal + maintenanceTotal;
    } catch (error) {
      console.error("Error calculating total expenses:", error);
      return 0;
    }
  };

  const calculateTotalIncome = () => {
    try {
      if (!Array.isArray(rentData)) {
        return 0;
      }

      return rentData
        .filter(payment => payment && payment.status === "paid" && typeof payment.amount === 'number')
        .reduce((acc, curr) => acc + curr.amount, 0);
    } catch (error) {
      console.error("Error calculating total income:", error);
      return 0;
    }
  };

  return {
    calculateROI,
    calculateTotalExpenses,
    calculateTotalIncome
  };
};
