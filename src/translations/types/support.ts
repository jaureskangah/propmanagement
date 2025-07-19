export interface SupportTranslations {
  // Header
  title: string;
  subtitle: string;
  backToDashboard: string;

  // Search
  searchPlaceholder: string;

  // Support Options
  chatTitle: string;
  chatDescription: string;
  emailTitle: string;
  emailDescription: string;
  phoneTitle: string;
  phoneDescription: string;
  docsTitle: string;
  docsDescription: string;
  available: string;

  // Quick Help
  quickHelpTitle: string;
  quickHelpDescription: string;
  quickHelp: {
    createProperty: string;
    addTenants: string;
    managePayments: string;
    scheduleMaintenance: string;
  };
  timeLabels: {
    min1: string;
    min2: string;
    min3: string;
  };
  categories: {
    start: string;
    management: string;
    finance: string;
    maintenance: string;
  };

  // System Status
  systemStatusTitle: string;
  systemStatusDescription: string;
  operational: string;
  services: {
    api: string;
    email: string;
    database: string;
  };
  lastCheckLabels: {
    seconds30: string;
    minute1: string;
    minutes2: string;
  };

  // Contact Information
  additionalHelpTitle: string;
  additionalHelpDescription: string;
}