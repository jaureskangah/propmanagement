
import type { FinancesTranslations } from "../types/finances";

// Export the translation functions so they can be imported in en.ts and fr.ts
export const enFinances: Record<string, string> = {};
export const frFinances: Record<string, string> = {};

// Add finance translations to the main translation object
export const addFinanceTranslations = (
  locale: 'en' | 'fr',
  translations: Record<string, string>
) => {
  if (locale === "en") {
    translations["finance.financialOverview"] = "Financial Overview";
    translations["finance.income"] = "Income";
    translations["finance.expense"] = "Expense";
    translations["finance.totalIncome"] = "Total Income";
    translations["finance.totalExpenses"] = "Total Expenses";
    translations["finance.occupancyRate"] = "Occupancy Rate";
    translations["finance.unpaidRent"] = "Unpaid Rent";
    translations["finance.revenueAndExpenses"] = "Revenue and Expenses";
    
    // More accurate translations
    translations["finance.occupancyRateDescription"] = "Percentage of occupied units";
    translations["finance.unpaidRentDescription"] = "Amount of rent not yet collected";
    
    // Adding missing translations
    translations["finance.allTimeIncome"] = "All-time income";
    translations["finance.allTimeExpenses"] = "All-time expenses";
    translations["finance.yearlyData"] = "Yearly data";
    translations["finance.monthlyData"] = "Monthly data";
    translations["finance.unitNumber"] = "Unit number";
    translations["finance.monthly"] = "Monthly";
    translations["finance.yearly"] = "Yearly";
    translations["finance.all"] = "All";
    translations["finance.profit"] = "Profit";
    translations["finance.showAll"] = "Show all";
    translations["finance.showIncome"] = "Show income";
    translations["finance.showExpense"] = "Show expense";
    translations["finance.showProfit"] = "Show profit";
    translations["finance.noDataAvailable"] = "No data available";
    translations["finance.authRequired"] = "Authentication required";
    translations["finance.selectProperty"] = "Select property";
    translations["finance.noPropertiesAvailable"] = "No properties available";
    
    // Error and notification related translations
    translations["finance.errorLoadingData"] = "Error loading data";
    translations["finance.errorLoadingMetrics"] = "Error loading financial metrics";
    translations["finance.errorLoadingOverview"] = "Error loading financial overview";
    translations["finance.unexpectedError"] = "An unexpected error occurred";
    translations["finance.refreshing"] = "Refreshing data...";
    translations["finance.attemptingToRefreshData"] = "Attempting to refresh data";
    translations["finance.tryAgain"] = "Try again";
    
    // Populate the exported object for en
    Object.keys(translations)
      .filter(key => key.startsWith('finance.'))
      .forEach(key => {
        enFinances[key.replace('finance.', '')] = translations[key];
      });
  } else if (locale === "fr") {
    translations["finance.financialOverview"] = "Vue d'ensemble financière";
    translations["finance.income"] = "Revenus";
    translations["finance.expense"] = "Dépenses";
    translations["finance.totalIncome"] = "Revenu total";
    translations["finance.totalExpenses"] = "Dépenses totales";
    translations["finance.occupancyRate"] = "Taux d'occupation";
    translations["finance.unpaidRent"] = "Loyers impayés";
    translations["finance.revenueAndExpenses"] = "Revenus et Dépenses";
    
    // Traductions plus précises
    translations["finance.occupancyRateDescription"] = "Pourcentage d'unités occupées";
    translations["finance.unpaidRentDescription"] = "Montant des loyers non encore perçus";
    
    // Adding missing translations
    translations["finance.allTimeIncome"] = "Revenus totaux";
    translations["finance.allTimeExpenses"] = "Dépenses totales";
    translations["finance.yearlyData"] = "Données annuelles";
    translations["finance.monthlyData"] = "Données mensuelles";
    translations["finance.unitNumber"] = "Numéro d'unité";
    translations["finance.monthly"] = "Mensuel";
    translations["finance.yearly"] = "Annuel";
    translations["finance.all"] = "Tous";
    translations["finance.profit"] = "Profit";
    translations["finance.showAll"] = "Afficher tout";
    translations["finance.showIncome"] = "Afficher revenus";
    translations["finance.showExpense"] = "Afficher dépenses";
    translations["finance.showProfit"] = "Afficher profit";
    translations["finance.noDataAvailable"] = "Aucune donnée disponible";
    translations["finance.authRequired"] = "Authentification requise";
    translations["finance.selectProperty"] = "Sélectionner une propriété";
    translations["finance.noPropertiesAvailable"] = "Aucune propriété disponible";
    
    // Error and notification related translations
    translations["finance.errorLoadingData"] = "Erreur lors du chargement des données";
    translations["finance.errorLoadingMetrics"] = "Erreur lors du chargement des métriques financières";
    translations["finance.errorLoadingOverview"] = "Erreur lors du chargement de l'aperçu financier";
    translations["finance.unexpectedError"] = "Une erreur inattendue s'est produite";
    translations["finance.refreshing"] = "Actualisation des données...";
    translations["finance.attemptingToRefreshData"] = "Tentative d'actualisation des données";
    translations["finance.tryAgain"] = "Réessayer";
    
    // Populate the exported object for fr
    Object.keys(translations)
      .filter(key => key.startsWith('finance.'))
      .forEach(key => {
        frFinances[key.replace('finance.', '')] = translations[key];
      });
  }
};

// Call the function to populate the exported objects
addFinanceTranslations('en', enFinances);
addFinanceTranslations('fr', frFinances);
