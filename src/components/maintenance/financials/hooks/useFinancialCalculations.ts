
interface FinancialData {
  expenses: any[];
  maintenance: any[];
  rentData: any[];
  properties?: any[];
  tenants?: any[];
}

export const useFinancialCalculations = ({ expenses, maintenance, rentData, properties = [], tenants = [] }: FinancialData) => {
  const calculateOccupancyRate = () => {
    try {
      // Calculer le taux d'occupation basé sur les unités occupées / unités totales
      const totalUnits = properties.reduce((acc, property) => acc + (property.units || 0), 0);
      const occupiedUnits = tenants.length; // Nombre de locataires actifs
      
      if (totalUnits === 0) {
        return "0.0";
      }
      
      const occupancyRate = (occupiedUnits / totalUnits) * 100;
      return Math.min(occupancyRate, 100).toFixed(1);
    } catch (error) {
      console.error("Error calculating occupancy rate:", error);
      return "0.0";
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
