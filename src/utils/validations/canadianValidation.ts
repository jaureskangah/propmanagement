import { z } from 'zod';
import { validateCanadianPostalCode, CANADIAN_PROVINCES } from '@/types/canadianData';

// Schema de validation pour les adresses canadiennes
export const canadianAddressSchema = z.object({
  address: z.string()
    .min(5, "L'adresse civique doit contenir au moins 5 caractères")
    .max(100, "L'adresse ne peut pas dépasser 100 caractères"),
    
  city: z.string()
    .min(2, "La ville doit contenir au moins 2 caractères")
    .max(50, "Le nom de la ville ne peut pas dépasser 50 caractères")
    .regex(/^[a-zA-ZÀ-ÿ\s-']+$/, "La ville ne peut contenir que des lettres, espaces, traits d'union et apostrophes"),
    
  province: z.enum(
    CANADIAN_PROVINCES.map(p => p.code) as [string, ...string[]], 
    { required_error: "Veuillez sélectionner une province ou territoire" }
  ),
  
  postal_code: z.string()
    .min(6, "Le code postal est requis")
    .max(7, "Format de code postal invalide")
    .refine(validateCanadianPostalCode, {
      message: "Format de code postal canadien invalide. Utilisez le format A1A 1A1"
    })
    .transform(code => code.replace(/\s+/g, ' ').toUpperCase())
});

// Message d'erreur pour les utilisateurs non-canadiens
export const NON_CANADIAN_ERROR_MESSAGE = {
  title: "Service disponible au Canada uniquement",
  description: "PropertyPilot est actuellement disponible au Canada seulement. Souhaitez-vous être notifié quand nous étendrons nos services?",
  actionText: "Être notifié de l'expansion internationale"
};