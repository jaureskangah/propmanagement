export interface SupportTranslations {
  title: string;
  subtitle: string;
  backToDashboard: string;
  searchPlaceholder: string;
  supportOptions: {
    chat: {
      title: string;
      description: string;
    };
    email: {
      title: string;
      description: string;
    };
    phone: {
      title: string;
      description: string;
    };
    docs: {
      title: string;
      description: string;
    };
  };
  quickHelp: {
    title: string;
    subtitle: string;
    articles: {
      createProperty: string;
      addTenants: string;
      managePayments: string;
      scheduleMaintenance: string;
    };
    categories: {
      getting_started: string;
      management: string;
      finance: string;
      maintenance: string;
    };
  };
  systemStatus: {
    title: string;
    subtitle: string;
    operational: string;
    services: {
      api: string;
      email: string;
      database: string;
    };
    lastCheck: string;
  };
  contactInfo: {
    title: string;
    subtitle: string;
  };
  badges: {
    available: string;
  };
  timeUnits: {
    minutes: string;
    ago: string;
  };
}