
import { ModalCommonTranslations } from '../../types/modal/common';
import { ModalFieldsTranslations } from '../../types/modal/fields';
import { ModalPlaceholdersTranslations } from '../../types/modal/placeholders';
import { ModalValidationTranslations } from '../../types/modal/validation';
import { ModalActionsTranslations } from '../../types/modal/actions';

import { enModalCommon } from './en/common';
import { enModalFields } from './en/fields';
import { enModalPlaceholders } from './en/placeholders';
import { enModalValidation } from './en/validation';
import { enModalActions } from './en/actions';

import { frModalCommon } from './fr/common';
import { frModalFields } from './fr/fields';
import { frModalPlaceholders } from './fr/placeholders';
import { frModalValidation } from './fr/validation';
import { frModalActions } from './fr/actions';

export interface ModalTranslations extends 
  ModalCommonTranslations,
  ModalFieldsTranslations,
  ModalPlaceholdersTranslations,
  ModalValidationTranslations,
  ModalActionsTranslations {}

export const enModal: ModalTranslations = {
  ...enModalCommon,
  ...enModalFields,
  ...enModalPlaceholders,
  ...enModalValidation,
  ...enModalActions
};

export const frModal: ModalTranslations = {
  ...frModalCommon,
  ...frModalFields,
  ...frModalPlaceholders,
  ...frModalValidation,
  ...frModalActions
};

export type { ModalCommonTranslations } from '../../types/modal/common';
export type { ModalFieldsTranslations } from '../../types/modal/fields';
export type { ModalPlaceholdersTranslations } from '../../types/modal/placeholders';
export type { ModalValidationTranslations } from '../../types/modal/validation';
export type { ModalActionsTranslations } from '../../types/modal/actions';
