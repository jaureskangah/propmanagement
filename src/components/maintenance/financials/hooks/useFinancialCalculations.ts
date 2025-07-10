
interface FinancialData {
  expenses: any[];
  maintenance: any[];
  rentData: any[];
}

export const useFinancialCalculations = ({ expenses, maintenance, rentData }: FinancialData) => {
  const calculateOccupancyRate = () => {
    try {
      if (!Array.isArray(rentData)) {
        return "0.00";
      }

      // Calculer le taux d'occupation basé sur les paiements reçus
      // Supposons 12 mois par an et calculons le pourcentage de mois payés
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      
      const paidMonths = rentData
        .filter(payment => {
          if (!payment || payment.status !== "paid") return false;
          const paymentDate = new Date(payment.payment_date);
          return paymentDate.getFullYear() === currentYear;
        }).length;
      
      const occupancyRate = (paidMonths / currentMonth) * 100;
      return Math.min(occupancyRate, 100).toFixed(1);
    } catch (error) {
      console.error("Error calculating occupancy rate:", error);
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
    calculateOccupancyRate,
    calculateTotalExpenses,
    calculateTotalIncome
  };
};
