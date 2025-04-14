
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
    translations["finance.profit"] = "Profit";
    translations["finance.propertySummary"] = "Property Summary";
    translations["finance.selectProperty"] = "Select property";
    translations["finance.allProperties"] = "All Properties";
    translations["finance.monthly"] = "Monthly";
    translations["finance.yearly"] = "Yearly";
    translations["finance.total"] = "Total";
    translations["finance.quarter"] = "Quarter";
    translations["finance.quarter1"] = "Q1";
    translations["finance.quarter2"] = "Q2";
    translations["finance.quarter3"] = "Q3";
    translations["finance.quarter4"] = "Q4";
    translations["finance.jan"] = "Jan";
    translations["finance.feb"] = "Feb";
    translations["finance.mar"] = "Mar";
    translations["finance.apr"] = "Apr";
    translations["finance.may"] = "May";
    translations["finance.jun"] = "Jun";
    translations["finance.jul"] = "Jul";
    translations["finance.aug"] = "Aug";
    translations["finance.sep"] = "Sep";
    translations["finance.oct"] = "Oct";
    translations["finance.nov"] = "Nov";
    translations["finance.dec"] = "Dec";
    translations["finance.rentIncome"] = "Rent Income";
    translations["finance.maintenanceExpenses"] = "Maintenance Expenses";
    translations["finance.netProfit"] = "Net Profit";
    translations["finance.occupancyRate"] = "Occupancy Rate";
    translations["finance.propertyValue"] = "Property Value";
    translations["finance.roi"] = "ROI";
    translations["finance.annualReturn"] = "Annual Return";
    translations["finance.loading"] = "Loading financial data...";
    translations["finance.noDataAvailable"] = "No financial data available";
    translations["finance.leaseEndIn"] = "Lease end in";
    translations["finance.lastPayment"] = "Last payment";
    translations["finance.duePayments"] = "Due payments";
    translations["finance.paymentsOnTime"] = "Payments on time";
    translations["finance.compareToLastYear"] = "Compare to last year";
    translations["finance.more"] = "More";
    translations["finance.financialDataHeader"] = "Financial Data";
    translations["finance.financialStats"] = "Financial Statistics";
    translations["finance.financialData"] = "Financial Data";
    translations["finance.financialDataForProperty"] = "Financial Data for {property}";
    translations["finance.monthlyData"] = "Monthly Breakdown";
    translations["finance.yearlyData"] = "Yearly Breakdown";
    translations["finance.monthlyBreakdownDesc"] = "See income and expenses by month for the selected year";
    translations["finance.yearlyBreakdownDesc"] = "Compare yearly financial performance";
    translations["finance.refresh"] = "Refresh";
    translations["finance.export"] = "Export";
    translations["finance.exportPreparing"] = "Preparing your financial data export...";
    translations["finance.exportReady"] = "Your financial data export is ready to download";
    translations["finance.dataBeingRefreshed"] = "Financial data is being refreshed...";
    translations["finance.all"] = "All";
    translations["finance.showAll"] = "Show all data series";
    translations["finance.showIncome"] = "Show income only";
    translations["finance.showExpense"] = "Show expenses only";
    translations["finance.showProfit"] = "Show profit only";
    translations["finance.previousYear"] = "Previous Year";
    translations["finance.nextYear"] = "Next Year";
    
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
    translations["finance.profit"] = "Bénéfice";
    translations["finance.propertySummary"] = "Résumé de la propriété";
    translations["finance.selectProperty"] = "Sélectionner une propriété";
    translations["finance.allProperties"] = "Toutes les propriétés";
    translations["finance.monthly"] = "Mensuel";
    translations["finance.yearly"] = "Annuel";
    translations["finance.total"] = "Total";
    translations["finance.quarter"] = "Trimestre";
    translations["finance.quarter1"] = "T1";
    translations["finance.quarter2"] = "T2";
    translations["finance.quarter3"] = "T3";
    translations["finance.quarter4"] = "T4";
    translations["finance.jan"] = "Jan";
    translations["finance.feb"] = "Fév";
    translations["finance.mar"] = "Mar";
    translations["finance.apr"] = "Avr";
    translations["finance.may"] = "Mai";
    translations["finance.jun"] = "Jun";
    translations["finance.jul"] = "Jul";
    translations["finance.aug"] = "Aoû";
    translations["finance.sep"] = "Sep";
    translations["finance.oct"] = "Oct";
    translations["finance.nov"] = "Nov";
    translations["finance.dec"] = "Déc";
    translations["finance.rentIncome"] = "Revenus de loyer";
    translations["finance.maintenanceExpenses"] = "Frais de maintenance";
    translations["finance.netProfit"] = "Bénéfice net";
    translations["finance.occupancyRate"] = "Taux d'occupation";
    translations["finance.propertyValue"] = "Valeur de la propriété";
    translations["finance.roi"] = "ROI";
    translations["finance.annualReturn"] = "Rendement annuel";
    translations["finance.loading"] = "Chargement des données financières...";
    translations["finance.noDataAvailable"] = "Aucune donnée financière disponible";
    translations["finance.leaseEndIn"] = "Fin du bail dans";
    translations["finance.lastPayment"] = "Dernier paiement";
    translations["finance.duePayments"] = "Paiements dus";
    translations["finance.paymentsOnTime"] = "Paiements à temps";
    translations["finance.compareToLastYear"] = "Comparer à l'année dernière";
    translations["finance.more"] = "Plus";
    translations["finance.financialDataHeader"] = "Données Financières";
    translations["finance.financialStats"] = "Statistiques Financières";
    translations["finance.financialData"] = "Données Financières";
    translations["finance.financialDataForProperty"] = "Données Financières pour {property}";
    translations["finance.monthlyData"] = "Répartition Mensuelle";
    translations["finance.yearlyData"] = "Répartition Annuelle";
    translations["finance.monthlyBreakdownDesc"] = "Voir les revenus et dépenses par mois pour l'année sélectionnée";
    translations["finance.yearlyBreakdownDesc"] = "Comparer la performance financière annuelle";
    translations["finance.refresh"] = "Actualiser";
    translations["finance.export"] = "Exporter";
    translations["finance.exportPreparing"] = "Préparation de l'export de données financières...";
    translations["finance.exportReady"] = "Votre export de données financières est prêt à télécharger";
    translations["finance.dataBeingRefreshed"] = "Les données financières sont en cours d'actualisation...";
    translations["finance.all"] = "Tous";
    translations["finance.showAll"] = "Afficher toutes les séries de données";
    translations["finance.showIncome"] = "Afficher seulement les revenus";
    translations["finance.showExpense"] = "Afficher seulement les dépenses";
    translations["finance.showProfit"] = "Afficher seulement les bénéfices";
    translations["finance.previousYear"] = "Année Précédente";
    translations["finance.nextYear"] = "Année Suivante";
    
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
