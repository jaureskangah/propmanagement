
import { FinancesTranslations } from '../types';

export const enFinances: FinancesTranslations = {
  finances: "Finances",
  financialOverview: "Financial Overview",
  income: "Income",
  expenses: "Expenses", // Changed from expense to expenses to match interface
  totalIncome: "Total Income", 
  totalExpenses: "Total Expenses",
  unpaidRent: "Unpaid Rent",
  selectProperty: "Select a property to view metrics",
  noPropertiesAvailable: "Please select a property to view its financial data",
  netIncome: "Net Income", // Adding missing fields from the interface
  addIncome: "Add Income",
  addExpense: "Add Expense",
  roi: "ROI",
  cashFlow: "Cash Flow",
  rentRoll: "Rent Roll",
  paymentHistory: "Payment History",
  rentCollection: "Rent Collection",
  category: "Category",
  date: "Date",
  amount: "Amount",
  description: "Description",
  property: "Property",
  unit: "Unit",
  paymentDate: "Payment Date",
  dueDate: "Due Date",
  status: "Status",
  noIncomeData: "No Income Data",
  noExpenseData: "No Expense Data",
  yearToDate: "Year to Date",
  selectYear: "Select Year",
  annualReturn: "Annual Return",
  expensesByCategory: "Expenses by Category",
  incomeTrend: "Income Trend",
  expenseTrend: "Expense Trend",
  totalRentPaid: "Total Rent Paid",
  paymentEvolution: "Payment Evolution",
  cumulativeTotal: "Cumulative Total",
  overallFinances: "Overall Finances",
  paid: "Paid",
  pending: "Pending",
  overdue: "Overdue",
  late: "Late",
  tenant: "Tenant",
  unitNumber: "Unit Number",
  allTimeIncome: "All Time Income",
  allTimeExpenses: "All Time Expenses",
  occupancyRate: "Occupancy Rate",
  occupancyRateDescription: "Percentage of occupied units",
  unpaidRentDescription: "Amount of rent not yet collected"
};

export const frFinances: FinancesTranslations = {
  finances: "Finances",
  financialOverview: "Aperçu financier",
  income: "Revenus",
  expenses: "Dépenses", // Changed from expense to expenses to match interface
  totalIncome: "Revenu total",
  totalExpenses: "Dépenses totales",
  unpaidRent: "Loyers impayés",
  selectProperty: "Sélectionnez une propriété pour voir les métriques",
  noPropertiesAvailable: "Veuillez sélectionner une propriété pour voir ses données financières",
  netIncome: "Revenu net", // Adding missing fields from the interface
  addIncome: "Ajouter un revenu",
  addExpense: "Ajouter une dépense",
  roi: "ROI",
  cashFlow: "Flux de trésorerie",
  rentRoll: "Loyer total",
  paymentHistory: "Historique des paiements",
  rentCollection: "Recouvrement de loyers",
  category: "Catégorie",
  date: "Date",
  amount: "Montant",
  description: "Description",
  property: "Propriété",
  unit: "Unité",
  paymentDate: "Date de paiement",
  dueDate: "Date d'échéance",
  status: "Statut",
  noIncomeData: "Aucune donnée de revenu",
  noExpenseData: "Aucune donnée de dépense",
  yearToDate: "Depuis le début de l'année",
  selectYear: "Sélectionner une année",
  annualReturn: "Rendement annuel",
  expensesByCategory: "Dépenses par catégorie",
  incomeTrend: "Tendance des revenus",
  expenseTrend: "Tendance des dépenses",
  totalRentPaid: "Total des loyers payés",
  paymentEvolution: "Évolution des paiements",
  cumulativeTotal: "Total cumulé",
  overallFinances: "Finances générales",
  paid: "Payé",
  pending: "En attente",
  overdue: "En retard",
  late: "Retard",
  tenant: "Locataire",
  unitNumber: "Numéro d'unité",
  allTimeIncome: "Revenus de tous les temps",
  allTimeExpenses: "Dépenses de tous les temps",
  occupancyRate: "Taux d'occupation",
  occupancyRateDescription: "Pourcentage d'unités occupées",
  unpaidRentDescription: "Montant des loyers non encore perçus"
};

// Removing the addFinanceTranslations function that was causing type errors
// and replacing it with direct property assignments

// Add additional translations to the objects directly - these were previously added by the function
// English additional translations
enFinances.revenueAndExpenses = "Revenue and Expenses";
enFinances.allTime = "All Time";
enFinances.comparedToPreviousMonth = "Compared to previous month";
enFinances.yearlyData = "Yearly data";
enFinances.monthlyData = "Monthly data";
enFinances.monthly = "Monthly";
enFinances.yearly = "Yearly";
enFinances.all = "All";
enFinances.profit = "Profit";
enFinances.showAll = "Show all";
enFinances.showIncome = "Show income";
enFinances.showExpense = "Show expense";
enFinances.showProfit = "Show profit";
enFinances.noDataAvailable = "No data available";
enFinances.authRequired = "Authentication required";
enFinances.vendor = "Vendor";
enFinances.selectVendor = "Select a vendor";
enFinances.noVendor = "No vendor";
enFinances.notSpecified = "Not specified";
enFinances.propertyExpenses = "Property expenses";

// French additional translations
frFinances.revenueAndExpenses = "Revenus et Dépenses";
frFinances.allTime = "Tout le temps";
frFinances.comparedToPreviousMonth = "Par rapport au mois précédent";
frFinances.yearlyData = "Données annuelles";
frFinances.monthlyData = "Données mensuelles";
frFinances.monthly = "Mensuel";
frFinances.yearly = "Annuel";
frFinances.all = "Tous";
frFinances.profit = "Profit";
frFinances.showAll = "Afficher tout";
frFinances.showIncome = "Afficher revenus";
frFinances.showExpense = "Afficher dépenses";
frFinances.showProfit = "Afficher profit";
frFinances.noDataAvailable = "Aucune donnée disponible";
frFinances.authRequired = "Authentification requise";
frFinances.vendor = "Fournisseur";
frFinances.selectVendor = "Sélectionner un fournisseur";
frFinances.noVendor = "Aucun fournisseur";
frFinances.notSpecified = "Non spécifié";
frFinances.propertyExpenses = "Dépenses de la propriété";
