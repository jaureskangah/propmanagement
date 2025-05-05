
import type { ModalValidationTranslations } from '../../../types/modal/validation';

export const frModalValidation: ModalValidationTranslations = {
  required: "Ce champ est requis",
  minLength: "Doit contenir au moins {min} caractères",
  maxLength: "Doit contenir au maximum {max} caractères",
  invalidEmail: "Adresse email invalide",
  passwordsDoNotMatch: "Les mots de passe ne correspondent pas",
  passwordTooWeak: "Le mot de passe est trop faible",
  invalidURL: "URL invalide",
  invalidPhone: "Numéro de téléphone invalide",
  invalidZipCode: "Code postal invalide",
  invalidAmount: "Montant invalide",
  invalidDate: "Date invalide",
  pastDate: "La date ne peut pas être dans le passé",
  futureDate: "La date ne peut pas être dans le futur",
  invalidTime: "Heure invalide",
  form: {
    required: "Ce champ est requis"
  }
};
