
/**
 * Point d'entrée unique pour les utilitaires de documents
 * Ce fichier rassemble et exporte toutes les fonctionnalités liées aux documents
 */

// Exporter les fonctions d'encodage d'URL
export * from './urlEncoder';

// Exporter les fonctions de gestion des URL de fichiers
export * from './fileUrl';

// Exporter les fonctions d'actions sur les documents
export * from './documentActions';

// Réexporter le type TenantDocument pour la commodité des imports
import { TenantDocument } from "@/types/tenant";
export type { TenantDocument };
