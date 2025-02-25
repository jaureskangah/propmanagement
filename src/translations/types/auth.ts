
export interface AuthTranslations {
  welcome: string;
  authDescription: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  iAmTenant: string;
  register: string;
  processingRegistration: string;
  processingLogin: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  signInCta: string;
  signUpCta: string;
  processingCta: string;
  authErrorTitle: string;
  invalidCredentials: string;
  emailNotConfirmed: string;
  generalAuthError: string;
  loginRequired: string;  // Added this property
  validation: {
    emailRequired: string;
    emailInvalid: string;
    passwordRequired: string;
    passwordMinLength: string;
    passwordsDoNotMatch: string;
    firstNameRequired: string;
    lastNameRequired: string;
  };
}
