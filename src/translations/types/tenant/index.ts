
import { TenantFormTranslations } from './form';
import { TenantListTranslations } from './list';
import { TenantLeaseTranslations } from './lease';
import { TenantDocumentsTranslations } from './documents';
import { TenantCommunicationsTranslations } from './communications';
import { TenantPaymentsTranslations } from './payments';
import { TenantProfileTranslations } from './profile';
import { TenantMessagesTranslations } from './messages';

export interface TenantTranslations 
  extends TenantFormTranslations,
    TenantListTranslations,
    TenantLeaseTranslations,
    TenantDocumentsTranslations,
    TenantCommunicationsTranslations,
    TenantPaymentsTranslations,
    TenantProfileTranslations,
    TenantMessagesTranslations {}

export * from './form';
export * from './list';
export * from './lease';
export * from './documents';
export * from './communications';
export * from './payments';
export * from './profile';
export * from './messages';
