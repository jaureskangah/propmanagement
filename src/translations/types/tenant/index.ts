
import type { TenantFormTranslations } from './form';
import type { TenantListTranslations } from './list';
import type { TenantLeaseTranslations } from './lease';
import type { TenantDocumentsTranslations } from './documents';
import type { TenantCommunicationsTranslations } from './communications';
import type { TenantPaymentsTranslations } from './payments';
import type { TenantProfileTranslations } from './profile';
import type { TenantMessagesTranslations } from './messages';
import type { TenantMaintenanceTranslations } from './maintenance';

// Créer un type d'intersection plutôt qu'une extension d'interface pour éviter les conflits
export type TenantTranslations = 
  & Omit<TenantFormTranslations, 'active' | 'leaseActive' | 'expired' | 'expiring' | 'notAvailable'> 
  & Omit<TenantListTranslations, 'active' | 'expired' | 'expiring' | 'notAvailable'> 
  & TenantLeaseTranslations
  & TenantDocumentsTranslations 
  & TenantCommunicationsTranslations
  & TenantPaymentsTranslations
  & Omit<TenantProfileTranslations, 'leaseActive' | 'leaseExpired' | 'leaseExpiring' | 'notAvailable'>
  & TenantMessagesTranslations
  & TenantMaintenanceTranslations
  // Réintroduire les propriétés en conflit avec des types explicites
  & {
    active: string;
    expired: string;
    expiring: string;
    leaseActive: string;
    leaseExpired: string;
    leaseExpiring: string;
    notAvailable: string;
  };

export * from './form';
export * from './list';
export * from './lease';
export * from './documents';
export * from './communications';
export * from './payments';
export * from './profile';
export * from './messages';
export * from './maintenance';
