
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

export * from './common';
export * from './fields';
export * from './placeholders';
export * from './validation';
export * from './actions';
