
import type { TenantTranslations } from '../../types/tenant';
import { enForm } from './en/form';
import { enList } from './en/list';
import { enLease } from './en/lease';
import { enDocuments } from './en/documents';
import { enCommunications } from './en/communications';
import { enPayments } from './en/payments';
import { enProfile } from './en/profile';
import { enMessages } from './en/messages';

import { frForm } from './fr/form';
import { frList } from './fr/list';
import { frLease } from './fr/lease';
import { frDocuments } from './fr/documents';
import { frCommunications } from './fr/communications';
import { frPayments } from './fr/payments';
import { frProfile } from './fr/profile';
import { frMessages } from './fr/messages';

export const enTenant: TenantTranslations = {
  ...enForm,
  ...enList,
  ...enLease,
  ...enDocuments,
  ...enCommunications,
  ...enPayments,
  ...enProfile,
  ...enMessages,
};

export const frTenant: TenantTranslations = {
  ...frForm,
  ...frList,
  ...frLease,
  ...frDocuments,
  ...frCommunications,
  ...frPayments,
  ...frProfile,
  ...frMessages,
};
