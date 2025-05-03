
import { ModalCommonTranslations } from './common';
import { ModalFieldsTranslations } from './fields';
import { ModalPlaceholdersTranslations } from './placeholders';
import { ModalValidationTranslations } from './validation';
import { ModalActionsTranslations } from './actions';

export interface ModalTranslations extends 
  ModalCommonTranslations,
  ModalFieldsTranslations,
  ModalPlaceholdersTranslations,
  ModalValidationTranslations,
  ModalActionsTranslations {}

export type { ModalCommonTranslations };
export type { ModalFieldsTranslations };
export type { ModalPlaceholdersTranslations };
export type { ModalValidationTranslations };
export type { ModalActionsTranslations };
