
import { ErrorTranslations } from '../types/errors';

export const enErrors: ErrorTranslations = {
  // Common errors
  generalError: "An unexpected error occurred",
  networkError: "Network connection error. Please check your connection and try again",
  serverError: "Server error. Please try again later",
  validationError: "Please check the entered information",
  unauthorized: "You are not authorized to perform this action",
  notFound: "The requested resource was not found",
  
  // Form errors
  requiredField: "This field is required",
  invalidFormat: "Invalid format",
  invalidEmail: "Please enter a valid email address",
  weakPassword: "Password is too weak",
  passwordMismatch: "Passwords do not match",
  
  // Error guidance
  alreadyExists: "A record with this information already exists",
  relatedRecordNotFound: "A related record was not found",
  contactSupport: "Please contact support for assistance",
  tryAgain: "Please try again later",
  refreshPage: "Try refreshing the page",
  wrongPassword: "The password you entered is incorrect",
  
  // Authentication errors
  authRequired: "You must be logged in to perform this action",
  sessionExpired: "Your session has expired. Please log in again",
  invalidCredentials: "Invalid email or password",
  
  // Data errors
  failedToLoad: "Failed to load data. Please refresh the page",
  failedToSave: "Failed to save data. Please try again",
  failedToDelete: "Failed to delete item. Please try again",
  failedToUpdate: "Failed to update information. Please try again",
};

export const frErrors: ErrorTranslations = {
  // Common errors
  generalError: "Une erreur inattendue s'est produite",
  networkError: "Erreur de connexion réseau. Veuillez vérifier votre connexion et réessayer",
  serverError: "Erreur serveur. Veuillez réessayer plus tard",
  validationError: "Veuillez vérifier les informations saisies",
  unauthorized: "Vous n'êtes pas autorisé à effectuer cette action",
  notFound: "La ressource demandée n'a pas été trouvée",
  
  // Form errors
  requiredField: "Ce champ est obligatoire",
  invalidFormat: "Format invalide",
  invalidEmail: "Veuillez entrer une adresse email valide",
  weakPassword: "Le mot de passe est trop faible",
  passwordMismatch: "Les mots de passe ne correspondent pas",
  
  // Error guidance
  alreadyExists: "Un enregistrement avec ces informations existe déjà",
  relatedRecordNotFound: "Un enregistrement lié n'a pas été trouvé",
  contactSupport: "Veuillez contacter le support pour obtenir de l'aide",
  tryAgain: "Veuillez réessayer plus tard",
  refreshPage: "Essayez de rafraîchir la page",
  wrongPassword: "Le mot de passe que vous avez saisi est incorrect",
  
  // Authentication errors
  authRequired: "Vous devez être connecté pour effectuer cette action",
  sessionExpired: "Votre session a expiré. Veuillez vous reconnecter",
  invalidCredentials: "Email ou mot de passe invalide",
  
  // Data errors
  failedToLoad: "Impossible de charger les données. Veuillez rafraîchir la page",
  failedToSave: "Impossible d'enregistrer les données. Veuillez réessayer",
  failedToDelete: "Impossible de supprimer l'élément. Veuillez réessayer",
  failedToUpdate: "Impossible de mettre à jour les informations. Veuillez réessayer",
};
