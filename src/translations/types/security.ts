export interface SecurityTranslations {
  // Hero section
  securityPrivacy: string;
  securityHeroTitle: string;
  securityHeroDescription: string;
  startSecureTrial: string;
  
  // Security features section
  howWeProtectData: string;
  
  securityFeatures: {
    supabaseAuth: {
      title: string;
      description: string;
      details: string;
    };
    rowLevelSecurity: {
      title: string;
      description: string;
      details: string;
    };
    roleBasedAccess: {
      title: string;
      description: string;
      details: string;
    };
    secureStorage: {
      title: string;
      description: string;
      details: string;
    };
    sessionManagement: {
      title: string;
      description: string;
      details: string;
    };
    documentSecurity: {
      title: string;
      description: string;
      details: string;
    };
  };
  
  // Compliance section
  complianceCertifications: string;
  
  certifications: {
    supabaseSoc2: {
      title: string;
      description: string;
    };
    gdprCompliant: {
      title: string;
      description: string;
    };
    postgresqlSecurity: {
      title: string;
      description: string;
    };
    industryStandards: {
      title: string;
      description: string;
    };
  };
  
  // Data protection practices
  dataProtectionPractices: string;
  
  practices: {
    dataMinimization: {
      title: string;
      description: string;
    };
    userControl: {
      title: string;
      description: string;
    };
    dataIsolation: {
      title: string;
      description: string;
    };
    accessControl: {
      title: string;
      description: string;
    };
  };
  
  // CTA section
  questionsAboutSecurity: string;
  securityTeamDescription: string;
  contactSecurityTeam: string;
  readPrivacyPolicy: string;
}