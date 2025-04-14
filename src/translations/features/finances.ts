
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
    translations["finance.occupancyRate"] = "Taux d'occupation";
    translations["finance.unpaidRent"] = "Unpaid Rent";
    translations["finance.revenueAndExpenses"] = "Revenue and Expenses";
    
    // More accurate translations
    translations["finance.occupancyRateDescription"] = "Percentage of occupied units";
    translations["finance.unpaidRentDescription"] = "Amount of rent not yet collected";
    
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
